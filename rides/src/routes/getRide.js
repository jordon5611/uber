const express = require('express');
const { NotFoundError, requireUser } = require('@jordonuber/common');
const Ride = require('../model/Rides');

const getRideById = express.Router();

getRideById.get('/api/rides/:id', requireUser ,async (req, res) => {

  const ride = await Ride.findById(req.params.id).populate('driver passenger');

  if (!ride) {
    throw new NotFoundError('Ride not found');
  }

  res.status(200).json({ status: 'Success', data: ride });
});

module.exports = getRideById;