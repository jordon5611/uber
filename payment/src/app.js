const express = require('express');

const app = express();

const { notFound, errorHandlerMiddleware, Authentication } = require('@jordonuber/common');

//Authentication

app.use(express.json());

app.use(Authentication)

//Routes
const createPayment = require('./routes/createPayment')
const getPayment = require('./routes/getPayment');
const getRidePayment = require('./routes/getRidePayment');


app.use(createPayment);
app.use(getPayment);
app.use(getRidePayment);


//MiddleWare

app.use(notFound);

app.use(errorHandlerMiddleware);

module.exports = { app }