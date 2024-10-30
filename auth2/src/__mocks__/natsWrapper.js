// src/__mocks__/natsWrapper.js
const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation((subject, data, callback) => {

            callback(); // Simulate successful publish

        }),
    },
};

module.exports = { natsWrapper }