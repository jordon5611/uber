const express = require('express');
const { NotFoundError, BadRequestError ,Authentication } = require('@jordonuber/common');
const Ride = require('../model/Rides');
const Driver = require('../model/Driver');

//NATS

const { rideUpdatedPublisher } = require('../events/publisher/rideUpdatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const startRide = express.Router();

startRide.patch('/api/rides/:rideId/start', Authentication, async (req, res) => {
    const { userId } = req.user;
    const { rideId } = req.params;

    // Find the ride by ID
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new NotFoundError('Ride not found');
    }

    // Check if the driver is starting their assigned ride
    if (ride.driver.toString() !== userId) {
        return res.status(403).json({ error: 'You are not authorized to start this ride' });
    }

    // Check if the ride is already started
    if (ride.status == 'in_progress' || ride.status == 'completed' || ride.status == 'canceled') {
        throw new BadRequestError('Ride has already started or is completed');
    }

    //check if the user have paid for the ride using card or wallet
    if(ride.paymentMethod == 'card' || ride.paymentMethod == 'wallet') {
        if(ride.paymentStatus != 'completed') {
            throw new BadRequestError('Please complete payment before starting the ride or choose cash payment');
        }
    }

    // Start the ride
    ride.status = 'in_progress';
    ride.rideStartTime = new Date();

    await ride.save();

    // Update the driver's status to 'busy'
    const driver = await Driver.findById(userId);
    if (driver) {
        driver.status = 'busy';
        await driver.save();

    }

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
            rideStartTime: ride.rideStartTime,
            version: ride.version
        }
    });

    res.status(200).json({ status: 'Success', data: ride });
});

module.exports = startRide;
