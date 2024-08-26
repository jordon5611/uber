
const express = require('express');
const app = express();

//error handler

const { notFound, errorHandlerMiddleware } = require('@jordonuber/common');

//Routes
const registerDriver = require('./routes/registerDriver');
const loginDriver = require('./routes/loginDriver');
const getDriver = require('./routes/getDriver');
const updateDriver = require('./routes/updateDriver');
const deleteDriver = require('./routes/deleteDriver');
const updateDriverStatus = require('./routes/driverAvailablity');
const uploadLicense = require('./routes/uploadLicense');

app.use(express.json());

app.use(registerDriver)
app.use(loginDriver)
app.use(getDriver)
app.use(updateDriver)
app.use(deleteDriver)
app.use(updateDriverStatus)
app.use(uploadLicense)

//MiddleWare

app.use(notFound);

app.use(errorHandlerMiddleware);


module.exports = { app }