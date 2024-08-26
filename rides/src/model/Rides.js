const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const RideSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    pickupLocation: {
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    dropoffLocation: {
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'completed', 'canceled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'wallet'],
        required: true
    },
    rating: {
        passengerRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        driverRating: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    rideStartTime: {
        type: Date,
    },
    rideEndTime: {
        type: Date,
    },
}, {timestamps: true,});

RideSchema.set('versionKey', 'version')
RideSchema.plugin(updateIfCurrentPlugin)

module.exports = mongoose.model('Ride', RideSchema);
