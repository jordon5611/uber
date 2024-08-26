const express = require('express');
const { body } = require('express-validator');

const { NotFoundError, UnAuthorizedError, validatorMiddleware, Authentication } = require('@jordonuber/common')

const User = require('../model/User');

//NATS
const { natsWrapper } = require('../natsWrapper');
const { UserCreatedPublisher } = require('../events/publisher/usercreated-Publisher');


const Signup = express.Router();

Signup.post('/auth/signup',
    [
        body('name').not().notEmpty().isLength({ min: 3 }).withMessage('Name must be at least 2 characters long and must be valid'),
        body('email').not().notEmpty().isEmail().withMessage('Invalid email address and must be valid'),
        body('password').not().notEmpty().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long and must be valid'),
        body('country').not().notEmpty().isString().withMessage('Country must be valid'),
        body('phoneNumber').not().notEmpty().isString().withMessage('Phone number must be valid'),
    ], validatorMiddleware,
    async (req, res) => {

        // Extract email and password from the request body
        const { name, email, password, country, phoneNumber } = req.body;

        const newUser = new User({ name, email, password, country, phoneNumber })

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); 

        newUser.code = verificationCode

        //Send Message

        // await client.messages.create({
        //     body: `Your verification code is ${verificationCode}`,
        //     from: '+923404810038',
        //     to: phoneNumber
        // });

        await newUser.save()

        //NATS
        const userCreatedEvent = new UserCreatedPublisher(natsWrapper.client)
        await userCreatedEvent.publish({
            name: newUser.name,
            email: newUser.email,
            id: newUser._id,
            country: newUser.country,
            phoneNumber: newUser.phoneNumber,
            version: newUser.version
        })

        const token = newUser.createToken()


        res.status(201).json({ data: newUser, token });
    }
);

//SMS verfication

Signup.post('/api/users/verfication', Authentication,
    [
        body('code').not().notEmpty().isLength({ min: 6 }).withMessage('Code must be at least 6 characters long')
    ], validatorMiddleware
    , async (req, res) => {

        const { code } = req.body
        const id = req.user.userId

        const user = await User.findById(id)
        if (!user) {
            throw new NotFoundError('User not found. Please create new Account!')
        }

        if (code == user.code) {
            user.isPhoneVerified = true

            await user.save()
            res.status(200).json({ data: user })

        } else {
            throw new UnAuthorizedError('Code is Incorrect')
        }

    });

module.exports = Signup;
