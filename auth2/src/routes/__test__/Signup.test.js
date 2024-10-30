// test/signup.test.js
const request = require('supertest');
const { app } = require('../../app'); // Your Express app
const User = require('../../model/User');
const { natsWrapper } = require('../../natsWrapper'); // Import the natsWrapper

// Load setup file
require('../../test/setup');
jest.mock('../../natsWrapper');

describe('Signup Route', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        await User.deleteMany({});
    });

    it('should create a new user on valid signup request', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                country: 'USA',
                phoneNumber: '+1234567890'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('name', 'John Doe');
        expect(response.body.data).toHaveProperty('email', 'johndoe@example.com');
        expect(response.body).toHaveProperty('token');

        // Verify NATS publishing
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });

    it('should fail if invalid email is provided', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'John Doe',
                email: 'invalid-email',
                password: 'password123',
                country: 'USA',
                phoneNumber: '+1234567890'
            });

        expect(response.status).toBe(400);
        expect(response.body.err).toContain('Invalid email address and must be valid');
    });

    it('should fail if password is less than 6 characters', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123',
                country: 'USA',
                phoneNumber: '+1234567890'
            });

        expect(response.status).toBe(400);
        expect(response.body.err).toContain('Password must be at least 6 characters long and must be valid');
    });

    it('should fail if name is empty', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: '',
                email: 'johndoe@example.com',
                password: 'password123',
                country: 'USA',
                phoneNumber: '+1234567890'
            });

        expect(response.status).toBe(400);
        expect(response.body.err).toContain('Name must be at least 2 characters long and must be valid');
    });

    it('should fail if country is empty', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                country: '',
                phoneNumber: '+1234567890'
            });

        expect(response.status).toBe(400);
        expect(response.body.err).toContain('Invalid value');
    });

    it('should fail if phone number is empty', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                country: 'USA',
                phoneNumber: ''
            });

        expect(response.status).toBe(400);
        expect(response.body.err).toContain('Invalid value');
    });
});