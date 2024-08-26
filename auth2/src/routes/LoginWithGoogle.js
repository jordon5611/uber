const express = require('express');
const passport = require('passport');
const User = require('../model/User');
const LoginWithGoogle = express.Router();


LoginWithGoogle.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

LoginWithGoogle.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    async (req, res) => {
        // On successful authentication, generate a JWT token
        const user = req.user;

        const token = user.createToken();

        // Return the token in the response or as a cookie
        res.json({ status: 'Success', token });
    }
);

LoginWithGoogle.get('/auth/protected', (req, res) => {
    res.send('Hello from protected route');
})

LoginWithGoogle.get('/auth/google/failure', (req, res) => {
    res.send('Hello from failure route');
})

LoginWithGoogle.get('/auth/all', async(req, res) => {
    const users  = await User.find({});
    res.send(users)
})

module.exports = LoginWithGoogle