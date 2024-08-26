const express = require('express');
const { NotFoundError, requireUser } = require('@jordonuber/common');
const User = require('../model/User');

const { UserDeletedPublisher } = require('../events/publisher/userDeletedPublisher')
const natsWrapper = require('../natsWrapper');

const deleteUser = express.Router();

deleteUser.delete('/api/user/deleteUser', requireUser, async (req, res) => {

    const { userId } = req.user

    const user = await User.findById(userId)

    if (!user) {
        throw new NotFoundError('User not Found')
    }

    //delete user
    await User.findByIdAndDelete(userId)

    //NATS
    const userDeletedEvent = new UserDeletedPublisher(natsWrapper.client)
    await userDeletedEvent.publish({
        id: user._id
    })


    res.status(200).json({ status: 'Success', message: 'Successfully Deleted the user' });
}
);

module.exports = deleteUser 
