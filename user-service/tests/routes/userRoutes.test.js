const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../../index'); // Adjust the path according to your structure
const User = require('../../src/models/User'); // Path to your User model

jest.mock('../../src/models/User'); // Ensure this path is correct

describe('User Registration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock data after each test
    });

    it('should register a user successfully', async () => {
        User.findOne.mockResolvedValue(null); // No user exists
        User.prototype.save = jest.fn().mockResolvedValue(); // Mock successful save

        const response = await request(app)
            .post('/user/register') // Route
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'ValidPass123!',
                role: 'student'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('msg', 'User created successfully');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
        expect(User.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 for missing fields', async () => {
        const response = await request(app)
            .post('/user/register') // Route
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                role: 'student' // Missing password
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'all input fields required');
    });

    it('should return 400 for existing user', async () => {
        User.findOne.mockResolvedValue({}); // Simulate existing user

        const response = await request(app)
            .post('/user/register') // Route
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'ValidPass123!',
                role: 'student'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'User already exists');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
    });

    it('should handle internal server error', async () => {
        User.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/user/register') // Route
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'ValidPass123!',
                role: 'student'
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Internal server error');
    });
});


afterAll(async () => {
    await mongoose.connection.close(); // Close Mongoose connection
});

afterAll(async () => {
    await server.close(); // Close the server
});
