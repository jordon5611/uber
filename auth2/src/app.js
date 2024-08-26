const express = require('express');
require('./passport');
const passport = require('passport');
const session = require('express-session');

const app = express();

//error handler

const { notFound, errorHandlerMiddleware } = require('@jordonuber/common')

//Routes
const Login = require('./routes/Login')
const Signup = require('./routes/Signup');
const ChangePassword = require('./routes/ChangePassword');
const LoginWithGoogle = require('./routes/LoginWithGoogle');


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

app.use(Login)
app.use(Signup)
app.use(ChangePassword)
app.use(LoginWithGoogle)

//MiddleWare

app.use(notFound);

app.use(errorHandlerMiddleware);

module.exports = { app }