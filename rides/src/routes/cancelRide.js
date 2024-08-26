const express = require('express');
const { NotFoundError, BadRequestError, requireUser } = require('@jordonuber/common');
const Ride = require('../model/Rides');
const Driver = require('../model/Driver');

//NATS

const { rideUpdatedPublisher } = require('../events/publisher/rideUpdatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const cancelRide = express.Router();

cancelRide.patch('/api/rides/:id/cancel', requireUser, async (req, res) => {

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
        throw new NotFoundError('Ride not found');
    }

    if (ride.passenger.toString() !== req.user.userId) {
        throw new NotFoundError('Unauthorized: You can only cancel your own rides');
    }

    // Check if the ride is already completed or canceled
    if ( ride.status == 'in_progress' || ride.status == 'completed' || ride.status == 'canceled') {
        throw new BadRequestError('Ride is not in state to be canceled');
    }

    const driver = await Driver.findById(ride.driver);

    driver.status = 'available';
    await driver.save();

    ride.status = 'canceled';
    ride.rideEndTime = new Date();
    await ride.save();

    //NATS

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
            version: ride.version
        }
    });

    res.status(200).json({ status: 'Success', data: ride });
});

module.exports = cancelRide;
