const express = require('express');
const { NotFoundError, requireUser, validatorMiddleware } = require('@jordonuber/common');
const Ride = require('../model/Rides');
const Driver = require('../model/Driver');
const { body } = require('express-validator');
const geolib = require('geolib');

//NATS

const { rideCreatedPublisher } = require('../events/publisher/rideCreatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const createRide = express.Router();

createRide.post('/api/rides', requireUser,
  [
    body('pickupLocation.address').not().isEmpty().withMessage('Pickup address is required'),
    body('pickupLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Pickup coordinates must be an array of [longitude, latitude]'),
    body('dropoffLocation.address').not().isEmpty().withMessage('Dropoff address is required'),
    body('dropoffLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Dropoff coordinates must be an array of [longitude, latitude]'),
    body('fare').isNumeric().withMessage('Fare is required'),
    body('paymentMethod').not().isEmpty().withMessage('Payment method is required').isIn(['card', 'cash', 'wallet']),
  ], validatorMiddleware,
  async (req, res) => {

    const { pickupLocation, dropoffLocation, fare, paymentMethod } = req.body;
    const passenger = req.user.userId;

    // Find an available driver within 10 km radius
    const drivers = await Driver.find({ status: 'available' });

    const nearbyDriver = drivers.find(driver =>
      geolib.isPointWithinRadius(
        { latitude: driver.location.coordinates[1], longitude: driver.location.coordinates[0] },
        { latitude: pickupLocation.coordinates[1], longitude: pickupLocation.coordinates[0] },
        10000 // 10 km radius
      )
    );

    if (!nearbyDriver) {
      throw new NotFoundError('No available driver found within 10 km');
    }

    const ride = new Ride({
      passenger,
      driver: nearbyDriver._id,
      pickupLocation,
      dropoffLocation,
      fare,
      paymentMethod,
    });

    await ride.save();

    // Update the driver's status to busy
    nearbyDriver.status = 'busy';
    await nearbyDriver.save();

    //NATS

    const rideCreatedEvent = new rideCreatedPublisher(natsWrapper.client);
    await rideCreatedEvent.publish({
      Driver: {
      id: nearbyDriver._id,
      status: nearbyDriver.status,
      version: nearbyDriver.version
      },
      ride
    });

    res.status(201).json({ status: 'Success', ride });
  }
);

module.exports = createRide;