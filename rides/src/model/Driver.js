const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const DriverSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: [true, 'Please Enter Your Email'],
        type: String,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    vehicleInfo: {
        Vechiletype:{
            type: String,
            required: true,
            enum: ['Car', 'Bike'],
        },
        model: {
            type: String,
            required: true,
        },
        plateNumber: {
            type: String,
            required: true,
            unique: true,
        },
        color: {
            type: String,
            required: true,
        },
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalRides: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'offline',
    },
    location: {
        type: {
            type: String, // "Point"
            enum: ['Point'], // must be "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
}, { timestamps: true})

// Create a geospatial index
DriverSchema.index({ location: '2dsphere' });

DriverSchema.set('versionKey', 'version')
DriverSchema.plugin(updateIfCurrentPlugin)



module.exports = mongoose.model('Driver', DriverSchema)