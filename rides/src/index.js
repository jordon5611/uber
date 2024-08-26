require('express-async-errors');

const mongoose = require('mongoose')

const { app } = require('./app');

//NATS

const { natsWrapper } = require('./natsWrapper');

//Listener

const { userCreatedListener } = require('./events/listener/userCreatedListener');
const { userUpdatedListener } = require('./events/listener/userUpdatedListener');
const { userDeletedListener } = require('./events/listener/userDeletedListener');
const { driverCreatedListener } = require('./events/listener/driverCreatedListener');
const { driverUpdatedListener } = require('./events/listener/driverUpdatedListener');
const { driverDeletedListener } = require('./events/listener/driverDeletedListener');
const { paymentCreatedListener } = require('./events/listener/paymentCreatedListener');


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

        //------------NATS--------------------
        //user
        new userCreatedListener(natsWrapper.client).listen();
        new userUpdatedListener(natsWrapper.client).listen();
        new userDeletedListener(natsWrapper.client).listen();
        //driver
        new driverCreatedListener(natsWrapper.client).listen();
        new driverUpdatedListener(natsWrapper.client).listen();
        new driverDeletedListener(natsWrapper.client).listen();
        //payment
        new paymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port} and Connected to DB`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
