const express = require('express');
const Ride = require('../model/Rides');
const { requireUser } = require('@jordonuber/common');

const getUserRides = express.Router();

getUserRides.get('/api/rides/user/:userId', requireUser, async (req, res) => {
  const rides = await Ride.find({ passenger: req.params.userId });

  res.status(200).json({ status: 'Success', data: rides });
});

module.exports = getUserRides;
