const express = require('express');
const { NotFoundError, requireUser } = require('@jordonuber/common');
const User = require('../model/User');

const getUser = express.Router();

getUser.get('/api/user/getUser', requireUser , async (req, res) => {

    const { userId } = req.user

    const user = await User.findById(userId)

    if(!user){
        throw new NotFoundError('User not Found')
    }

    res.status(200).json({ status: 'Success', data: user });
}
);

module.exports = getUser
