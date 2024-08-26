const express = require('express');
const { requireUser, NotFoundError } = require('@jordonuber/common');
const Payment = require('../model/Payment');

const getPayment = express.Router();

getPayment.get('/api/payment/:paymentId', requireUser, async (req, res) => {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new NotFoundError('Payment not found');
    }

    res.status(200).json({ status: 'Success', payment });
});

module.exports = getPayment;
