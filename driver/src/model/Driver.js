const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

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
    password: {
        required: [true, 'Please Enter Your Password'],
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    vehicleInfo: {
        Vechiletype: {
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
    licenseImage: {
        type: String,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
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
    code: {
        type: Number
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
}, { timestamps: true })

// Create a geospatial index
DriverSchema.index({ location: '2dsphere' });

DriverSchema.set('versionKey', 'version')
DriverSchema.plugin(updateIfCurrentPlugin)


DriverSchema.pre('save', async function () {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

DriverSchema.methods.createToken = function () {
    const token = jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_KEY, { expiresIn: '1d' })
    return token
}


DriverSchema.methods.comparePassword = async function (reqPassword) {
    const isMatch = await bcrypt.compare(reqPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', DriverSchema)