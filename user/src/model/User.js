const mongoose = require('mongoose');
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
    country:{
        required: [true, 'Please Enter Your Country'],
        type: String    
    },
    phoneNumber:{
        type: String,
        required: [true, 'Please Enter Your Phone Number'],
    }
}, { timestamps: true})

UserSchema.set('versionKey', 'version')
UserSchema.plugin(updateIfCurrentPlugin)


module.exports = mongoose.model('User', UserSchema)