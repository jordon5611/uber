const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'wallet'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        //required: true,
        unique: true
    }
}, { timestamps: true });

PaymentSchema.set('versionKey', 'version')

module.exports = mongoose.model('Payment', PaymentSchema);
