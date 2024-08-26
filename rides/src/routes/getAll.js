const express = require('express');
const { NotFoundError, requireUser } = require('@jordonuber/common');

const Driver = require('../model/Driver');
const User = require('../model/User');


const getAll = express.Router();

getAll.get('/api/rides/getAll', requireUser, async (req, res) => {

    const users = await User.find({});

    const drivers = await Driver.find({});



    res.status(200).json({ status: 'Success', users, drivers });
}
);

module.exports = getAll 
