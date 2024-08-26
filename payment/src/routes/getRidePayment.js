const express = require('express');
const { requireUser , NotFoundError } = require('@jordonuber/common');
const Payment = require('../model/Payment');

const getRidePayment = express.Router();

getRidePayment.get('/api/payment/ride/:rideId', requireUser, async (req, res) => {
    const { rideId } = req.params;

    const payment = await Payment.findOne({ rideId });

    if (!payment) {
        throw new NotFoundError('Payment for this ride not found');
    }

    res.status(200).json({ status: 'Success', data: payment });
});

module.exports = getRidePayment;
