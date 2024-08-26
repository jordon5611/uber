const express = require('express');
const { BadRequestError, NotFoundError } = require('@jordonuber/common');
const Driver = require('../model/Driver');

const loginDriver = express.Router();

loginDriver.post('/api/drivers/login', async (req, res) => {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
        throw new NotFoundError('Account not Found!');
    }

    const isMatch = await driver.comparePassword(password);
    if (!isMatch) {
        throw new BadRequestError('Invalid credentials');
    }

    const token = driver.createToken();

    res.status(200).json({ status: 'Success', data: { driver, token } });
});

module.exports = loginDriver;
