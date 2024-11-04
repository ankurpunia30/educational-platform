const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {app,server} = require('../../index'); // Replace with the path to your app file
const User = require('../../src/models/User'); // Replace with the path to your User model

jest.mock('../../src/models/User'); // Mock User model for testing

describe('Authentication Tests', () => {
    const mockUser = {
        _id: 'mockUserId',
        username: 'testuser',
        email: 'testuser@example.com',
        password: '$2b$10$somehashedpassword',
        role: 'student',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Registration Tests', () => {
        it('should register a new user successfully', async () => {
            User.findOne.mockResolvedValue(null); // User doesn't exist
            bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
            const newUser = { ...mockUser, password: 'hashedPassword' };
            User.prototype.save = jest.fn().mockResolvedValue(newUser);

            const response = await request(app)
                .post('/user/register')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'Password123!',
                    role: 'student',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('msg', 'User created successfully');
            expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
            expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
        });

        it('should return 400 if user already exists', async () => {
            User.findOne.mockResolvedValue(mockUser); // User exists

            const response = await request(app)
                .post('/user/register')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'Password123!',
                    role: 'student',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'User already exists');
        });
    });

    describe('Login Tests', () => {
        it('should log in successfully with correct credentials', async () => {
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue('mockToken');

            const response = await request(app)
                .post('/user/login')
                .send({
                    email: mockUser.email,
                    password: 'Password123!',
                    role: mockUser.role,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'Login successful');
            expect(response.headers).toHaveProperty('auth-token', 'mockToken');
        });

        it('should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({ email: mockUser.email });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'All input fields required');
        });

        it('should return 400 if user does not exist', async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/user/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!',
                    role: 'student',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'User does not exist');
        });

        it('should return 400 for incorrect password', async () => {
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            const response = await request(app)
                .post('/user/login')
                .send({
                    email: mockUser.email,
                    password: 'WrongPassword!',
                    role: mockUser.role,
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Invalid password');
        });

        it('should return 400 for incorrect role', async () => {
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);

            const response = await request(app)
                .post('/user/login')
                .send({
                    email: mockUser.email,
                    password: 'Password123!',
                    role: 'admin',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Invalid role');
        });
    });

    describe('Logout Tests', () => {
        it('should log out successfully', async () => {
            const response = await request(app)
                .post('/user/logout')
                .set('auth-token', 'mockToken');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'Logout successful');
            expect(response.headers['auth-token']).toBeUndefined();
        });
    });
});

describe('User Endpoints', () => {
    const mockUser = {
        _id: 'mockUserId',
        username: 'testuser',
        email: 'testuser@example.com',
        role: 'student',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        server.close(); // Ensure the server closes after tests
    });

    describe('GET /user/getUser', () => {
        it('should return user data if user is found', async () => {
            User.findOne.mockResolvedValue(mockUser);

            const response = await request(app)
                .get('/user/getUser')
                .send({ email: mockUser.email });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'User found');
            expect(response.body.user).toEqual(mockUser);
        });

        it('should return 404 if user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get('/user/getUser')
                .send({ email: 'notfound@example.com' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'User not found');
        });

        it('should return 500 if there is a server error', async () => {
            User.findOne.mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .get('/user/getUser')
                .send({ email: mockUser.email });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('msg', 'Server error');
        });
    });

    describe('DELETE /user/deleteUser', () => {
        it('should delete user successfully if user exists', async () => {
            User.findOneAndDelete.mockResolvedValue(mockUser);

            const response = await request(app)
                .delete('/user/deleteUser')
                .send({ email: mockUser.email });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'User deleted successfully');
        });

        it('should return 404 if user is not found', async () => {
            User.findOneAndDelete.mockResolvedValue(null);

            const response = await request(app)
                .delete('/user/deleteUser')
                .send({ email: 'notfound@example.com' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'User not found');
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .delete('/user/deleteUser')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Email is required');
        });

        it('should return 500 if there is a server error', async () => {
            User.findOneAndDelete.mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .delete('/user/deleteUser')
                .send({ email: mockUser.email });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('msg', 'Server error');
        });
    });

    describe('PUT /user/updateUser', () => {
        it('should update user successfully if user exists', async () => {
            const updatedUser = { ...mockUser, username: 'updatedUser' };
            User.findOneAndUpdate.mockResolvedValue(updatedUser);

            const response = await request(app)
                .put('/user/updateUser')
                .send({
                    email: mockUser.email,
                    updates: { username: 'updatedUser' }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'User updated successfully');
            expect(response.body.user).toEqual(updatedUser);
        });

        it('should return 404 if user is not found', async () => {
            User.findOneAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/user/updateUser')
                .send({
                    email: 'notfound@example.com',
                    updates: { username: 'updatedUser' }
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'User not found');
        });

        it('should return 400 if email or updates are missing', async () => {
            const response = await request(app)
                .put('/user/updateUser')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Email and updates are required');
        });

        it('should return 500 if there is a server error', async () => {
            User.findOneAndUpdate.mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .put('/user/updateUser')
                .send({
                    email: mockUser.email,
                    updates: { username: 'updatedUser' }
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('msg', 'Server error');
        });
    });
});
