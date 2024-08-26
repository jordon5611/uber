const express = require('express');
const { NotFoundError, BadRequestError, requireUser } = require('@jordonuber/common');
const Ride = require('../model/Rides');
const Driver = require('../model/Driver');

//NATS

const { rideUpdatedPublisher } = require('../events/publisher/rideUpdatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const completeRide = express.Router();

completeRide.patch('/api/rides/:id/complete', requireUser, async (req, res) => {

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
        throw new NotFoundError('Ride not found');
    }

    if (ride.driver.toString() !== req.user.userId) {
        throw new NotFoundError('Unauthorized: Only the assigned driver can complete this ride');
    }

    // Check if the ride is already completed or canceled
    if ( ride.status == 'completed' || ride.status == 'canceled') {
        throw new BadRequestError('Ride has already been completed');
    }

    
    const driver = await Driver.findById(ride.driver);

    driver.status = 'available';
    await driver.save();

    ride.status = 'completed';
    if (ride.paymentMethod == 'cash') ride.paymentStatus = 'completed';
    ride.rideEndTime = new Date();
    await ride.save();

    const rideUpdatedEvent = new rideUpdatedPublisher(natsWrapper.client);
    await rideUpdatedEvent.publish({
        Driver:{
        id: driver._id,
        status: driver.status,
        version: driver.version
        },
        ride:{
            id: ride._id,
            status: ride.status,
            rideEndTime: ride.rideEndTime,
            paymentStatus: ride.paymentStatus,
            version: ride.version
        }
    });
    res.status(200).json({ status: 'Success', data: ride });
});

module.exports = completeRide;
