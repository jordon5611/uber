const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.Cloudinary_Cloud_Name,
    api_key: process.env.Cloudinary_API_Key,
    api_secret: process.env.Cloudinary_API_Secret,    //epQVR5sDZW18ZCQKQBa08T6tS0g
});

module.exports = cloudinary;
