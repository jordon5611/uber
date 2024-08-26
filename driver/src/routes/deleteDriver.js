const express = require('express');
const { NotFoundError, Authentication } = require('@jordonuber/common');
const Driver = require('../model/Driver');

//NATS

const { DriverDeletedPublisher } = require('../events/publisher/driverDeletedPublisher');
const { natsWrapper } = require('../natsWrapper');

const deleteDriver = express.Router();

deleteDriver.delete('/api/drivers', Authentication, async (req, res) => {
    const { userId } = req.user;

    const driver = await Driver.findById(userId);

    if (!driver) {
        throw new NotFoundError('Driver not found');
    }

    await Driver.findByIdAndDelete(userId);

    //NATS

    const DriverDeletedEvent = new DriverDeletedPublisher(natsWrapper.client);
    await DriverDeletedEvent.publish({
        id: driver._id
    });

    res.status(200).json({ status: 'Success', message: 'Driver deleted successfully' });
});

module.exports = deleteDriver;
