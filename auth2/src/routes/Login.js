const express = require('express');
const { NotFoundError, UnAuthorizedError, validatorMiddleware } = require('@jordonuber/common');
const { body } = require('express-validator');
const User = require('../model/User');

const Login = express.Router();

Login.post('/auth/login',
    [
        body('email').not().notEmpty().isEmail().withMessage('Invalid email address'),
        body('password').not().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ], validatorMiddleware,
    async (req, res) => {

        // Extract email and password from the request body
        const { email, password } = req.body;

        const user = await User.findOne({email:email})

        if(!user){
            throw new NotFoundError('User not found. Please create new Account!')
        }

        const IsPasswordCorrect = await user.comparePassword(password)

        if(!IsPasswordCorrect){
            throw new UnAuthorizedError('Password is Incorrect')
        }
        const token = user.createToken()

        res.status(200).json({data: user, token})
    }
);

module.exports = Login;
