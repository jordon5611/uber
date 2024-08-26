const express = require('express');
const { NotFoundError, requireUser } = require('@jordonuber/common');
const User = require('../model/User');

const { UserUpdatedPublisher } = require('../events/publisher/userUpdatedPublisher')
const { natsWrapper } = require('../natsWrapper');

const updateUser = express.Router();

updateUser.patch('/api/user/updateUser', requireUser, async (req, res) => {

    const { userId } = req.user

    const user = await User.findById(userId)

    if (!user) {
        throw new NotFoundError('User not Found')
    }

    const {name, email, country} = req.body
    if(name){
        user.name = name
    }
    if(email){
    user.email = email
    }
    if(country){
    user.country = country
    }

    await user.save()

    //NATS
    const userUpdatedEvent = new UserUpdatedPublisher(natsWrapper.client)
    await userUpdatedEvent.publish({
        name: user.name,
        email: user.email,
        id: user._id,
        country: user.country,
        version: user.version
    })

    

    res.status(200).json({ status: 'success', user })
}
);

module.exports = updateUser;
