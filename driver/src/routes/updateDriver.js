const express = require('express');
const { NotFoundError, Authentication, requireUser } = require('@jordonuber/common');
const Driver = require('../model/Driver');

//NATS

const { DriverUpdatedPublisher } = require('../events/publisher/driverUpdatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const updateDriver = express.Router();

updateDriver.patch('/api/drivers', Authentication, requireUser, async (req, res) => {
    const { userId } = req.user;
    const { name, email, vehicleInfo, licenseNumber, location } = req.body;

    const driver = await Driver.findById(userId);

    if (!driver) {
        throw new NotFoundError('Driver not found');
    }

    if (name) driver.name = name;
    if (email) driver.email = email;
    if (vehicleInfo) driver.vehicleInfo = vehicleInfo;
    if (licenseNumber) driver.licenseNumber = licenseNumber;
    if (location) driver.location = location;

    await driver.save();

    //NATS

    const DriverUpdatedEvent = new DriverUpdatedPublisher(natsWrapper.client);
    await DriverUpdatedEvent.publish({
        id: driver._id,
        name: driver.name,
        email: driver.email,
        vehicleInfo: driver.vehicleInfo,
        location: driver.location,
        version: driver.version
    });

    res.status(200).json({ status: 'Success', driver });
});

module.exports = updateDriver;
