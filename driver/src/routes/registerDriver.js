const express = require('express');
const { BadRequestError } = require('@jordonuber/common');
const Driver = require('../model/Driver');

//NATS

const { DriverCreatedPublisher } = require('../events/publisher/driverCreatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const registerDriver = express.Router();

registerDriver.post('/api/drivers/register', async (req, res) => {
    const { name, email, password, vehicleInfo, licenseNumber } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
        throw new BadRequestError('Email already in use');
    }

    const driver = new Driver({
        name,
        email,
        password,
        vehicleInfo,
        licenseNumber
    });

    await driver.save();
    
    //NATS

    const DriverCreatedEvent = new DriverCreatedPublisher(natsWrapper.client);
    await DriverCreatedEvent.publish({
        id: driver._id,
        name: driver.name,
        email: driver.email,
        vehicleInfo: driver.vehicleInfo
    });


    const token = driver.createToken();

    res.status(201).json({ status: 'Success', data: { driver, token } });
});

module.exports = registerDriver;
