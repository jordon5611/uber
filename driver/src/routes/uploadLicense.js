const express = require('express');
const { NotFoundError, Authentication } = require('@jordonuber/common');
const Driver = require('../model/Driver');

//Image Files
const upload = require('../ImageFiles/multer-config');

//NATS

const { DriverUpdatedPublisher } = require('../events/publisher/driverUpdatedPublisher');
const { natsWrapper } = require('../natsWrapper');

const uploadLicense = express.Router();

uploadLicense.post('/api/drivers/upload-license', Authentication, upload.single('license'), async (req, res) => {
    const { userId } = req.user;

    const driver = await Driver.findById(userId);

    if (!driver) {
        throw new NotFoundError('Driver not found');
    }

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a license image' });
    }

    // Save the Cloudinary URL to the driver document
    driver.licenseImage = req.file.path;
    driver.isVerified = true;
    await driver.save();

    //NATS

    const DriverUpdatedEvent = new DriverUpdatedPublisher(natsWrapper.client);
    await DriverUpdatedEvent.publish({
        id: driver._id,
        isVerified: driver.isVerified,
        version: driver.version
    });

    res.status(200).json({ status: 'Success', message: 'License image uploaded successfully', data: driver });
});

module.exports = uploadLicense;
