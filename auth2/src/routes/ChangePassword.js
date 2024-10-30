const express = require('express');
const { NotFoundError, UnAuthorizedError, validatorMiddleware, Authentication } = require('@jordonuber/common');
const { body } = require('express-validator');
const User = require('../model/User');

const ChangePassword = express.Router();

ChangePassword.post('/auth/changePassword', Authentication,
    [
        body('currentPassword').not().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('newPassword').not().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ], validatorMiddleware,
    async (req, res) => {

        // Extract email and password from the request body
        const { currentPassword, newPassword } = req.body;

        const id = req.user.userId

        const user = await User.findById(id)

        if(!user){
            throw new NotFoundError('User not found. Please create new Account!')
        }

        const IsPasswordCorrect = await user.comparePassword(currentPassword)

        if(!IsPasswordCorrect){
            throw new UnAuthorizedError('Password is Incorrect')
        }

        user.password = newPassword

        res.status(200).json({data: user, token})
    }
);

module.exports = ChangePassword;
