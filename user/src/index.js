require('express-async-errors');

const express = require('express');
const mongoose = require('mongoose')
const app = express();

//NATS

const { natsWrapper } = require('./natsWrapper');

//Listener

const { userCreatedListener } = require('./events/listener/userCreatedListener');

//error handler

const { notFound, errorHandlerMiddleware, Authentication } = require('@jordonuber/common');

//Authentication

app.use(express.json());

app.use(Authentication)

//Routes
const getUser = require('./routes/getUser');
const updateUser = require('./routes/updateUser');
const deleteUser = require('./routes/deleteUser');


app.use(getUser)
app.use(updateUser)
app.use(deleteUser)


//MiddleWare

app.use(notFound);

app.use(errorHandlerMiddleware);

const port = 2000;

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("No Mongo URI found");
    }
    if (!process.env.JWT_KEY) {
        throw new Error("No Secret found");
    }
    if (!process.env.NATS_URI) {
        throw new Error("No Secret found");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("No Secret found");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("No Secret found");
    }

    try {
        console.log(process.env.NATS_CLIENT_ID);
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URI
        );
        natsWrapper.client.on("close", () => {
            console.log("Closing this Client");
            process.exit();
        });
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new userCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port} and Connected to DB`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
