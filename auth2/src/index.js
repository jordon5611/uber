require('express-async-errors');

const { app } = require('./app')
const mongoose = require('mongoose')
const { natsWrapper } = require('./natsWrapper');

//Listeners
const { userDeletedListener } = require('./events/listener/userDeleted-Listener');
const { userUpdatedListener } = require('./events/listener/userUpdated-Listener');


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
        //Nats
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

        new userDeletedListener(natsWrapper.client).listen()
        new userUpdatedListener(natsWrapper.client).listen()

        await mongoose.connect(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port} and Connected to DB!!`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
