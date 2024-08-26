const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const UserSchema = new mongoose.Schema({
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
        //required: [true, 'Please Enter Your Password'],
        type: String,
    },
    googleId: {
        type: String, // Store Google ID for OAuth users
    },
    country:{
        //required: [true, 'Please Enter Your Country'],
        type: String    
    },
    code:{
        type: Number    
    },
    phoneNumber:{
        type: String,
        //required: [true, 'Please Enter Your Phone Number'],
    },
    isPhoneVerified:{
        type: Boolean,
        default: false
    }
}, { timestamps: true })

UserSchema.set('versionKey', 'version')
UserSchema.plugin(updateIfCurrentPlugin)

UserSchema.pre('save', async function () {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

UserSchema.methods.createToken = function () {
    const token = jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_KEY, { expiresIn: '1d' })
    return token
}


UserSchema.methods.comparePassword = async function (reqPassword) {
    const isMatch = await bcrypt.compare(reqPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)