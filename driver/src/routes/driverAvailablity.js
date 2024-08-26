const express = require('express');
const { NotFoundError, Authentication } = require('@jordonuber/common');
const Driver = require('../model/Driver');

//NATS

const { DriverUpdatedPublisher } = require('../events/publisher/driverUpdatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const updateDriverStatus = express.Router();

updateDriverStatus.patch('/api/drivers/status', Authentication, async (req, res) => {
    const { userId } = req.user;
    const { status } = req.body;

    const driver = await Driver.findById(userId);

    if (!driver) {
        throw new NotFoundError('Driver not found');
    }

    driver.status = status;
    await driver.save();

    //NATS

    const DriverUpdatedEvent = new DriverUpdatedPublisher(natsWrapper.client);
    await DriverUpdatedEvent.publish({
        id: driver._id,
        status: driver.status,
        version: driver.version
    });

    res.status(200).json({ status: 'Success', data: driver });
});

module.exports = updateDriverStatus;
