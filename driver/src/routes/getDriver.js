const express = require('express');
const { NotFoundError, Authentication } = require('@jordonuber/common');
const Driver = require('../model/Driver');

const getDriver = express.Router();

getDriver.get('/api/drivers', Authentication, async (req, res) => {
    const { userId } = req.user;

    const driver = await Driver.findById(userId);

    if (!driver) {
        throw new NotFoundError('Driver not found');
    }

    res.status(200).json({ status: 'Success', data: driver });
});

module.exports = getDriver;
