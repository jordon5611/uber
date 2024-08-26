const express = require('express');
const { NotFoundError, BadRequestError, requireUser, validatorMiddleware } = require('@jordonuber/common');
const Payment = require('../model/Payment');
const Ride = require('../model/Rides');
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const stripe = require('../stripe')

//NATS

const { paymentCreatedPublisher } = require('../events/publisher/PaymentCreatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const createPayment = express.Router();

createPayment.post('/api/payment/createPayment', requireUser,
  [
    body('rideId').notEmpty().withMessage('Ride ID is required'),
    body('amount').isNumeric().withMessage('Amount is required and should be numeric'),
    body('paymentMethod').isIn(['card', 'cash', 'wallet']).withMessage('Invalid payment method'),
    body('token').optional().isString().withMessage('Payment token is required for card payments'),
  ],
  validatorMiddleware, async (req, res) => {

    // Extract the necessary information from the request

    const { rideId, amount, paymentMethod, token } = req.body;

    // Check if the ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new NotFoundError('Ride not found');
    }

    // check if already a payment is created with this ride

    const AlreadyPayment = await Payment.findOne({ rideId });
    if (AlreadyPayment) {
      throw new BadRequestError('Payment already created for this ride with Cash');
    }

    let paymentStatus = 'pending';
    let chargeId = null;

    // Handle card payments using Stripe
    if (paymentMethod === 'card') {
      if (!token) {
        throw new BadRequestError('Payment token is required for card payments');
      }


      const charge = await stripe.charges.create({
        amount: amount * 100, // Stripe expects the amount in cents
        currency: 'usd',
        source: token,
        description: `Payment for Ride ${rideId}`,
      });

      paymentStatus = 'completed';
      chargeId = charge.id;

    }
    if (paymentMethod === 'wallet') {
      //will add easypaise payment here
      paymentStatus = 'completed';
    }

    // Create the payment record
    const payment = new Payment({
      rideId,
      amount,
      paymentMethod,
      transactionId: chargeId || uuidv4(),
      status: paymentStatus,
    });

    await payment.save();

    ride.paymentStatus = paymentStatus;

    await ride.save();

    //NATS
    //create Payment Created Event

    const paymentCreatedEvent = new paymentCreatedPublisher(natsWrapper.client);
    await paymentCreatedEvent.publish({
      id: ride._id,
      paymentStatus: ride.paymentStatus,
      version: ride.version
    });

    res.status(201).json({ status: 'Success', data: payment });
  }
);

module.exports = createPayment;
