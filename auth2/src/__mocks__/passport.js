// src/__mocks__/passport.js
module.exports = {
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    use: jest.fn(),
    authenticate: jest.fn(() => (req, res, next) => next()),
};