const express = require('express');

const app = express();

const { notFound, errorHandlerMiddleware, Authentication } = require('@jordonuber/common');

//Authentication

app.use(express.json());

app.use(Authentication)

//Routes
const getAll = require('./routes/getAll')
const getRideById = require('./routes/getRide');
const completeRide = require('./routes/completeRide');
const cancelRide = require('./routes/cancelRide');
const createRide = require('./routes/createRide');
const getUserRides = require('./routes/getUserRides');
const startRide = require('./routes/startRide');


app.use(getAll);
app.use(getRideById);
app.use(completeRide);
app.use(cancelRide);
app.use(createRide);
app.use(getUserRides);
app.use(startRide);


//MiddleWare

app.use(notFound);

app.use(errorHandlerMiddleware);

module.exports = { app }