// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app }  = require('../app');
const User = require('../model/User');  // Adjust the path if necessary
const { natsWrapper } = require('../natsWrapper'); // Mock the NATS wrapper

let mongo;

// Mock the NATS client
jest.mock('../natsWrapper');
jest.mock('../passport'); 


// Setup MongoDB Memory Server and database connection
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
}, 10000);

// Clear database between tests
beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// Disconnect from database and stop MongoDB Memory Server after tests
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
});
