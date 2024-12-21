import { PrismaClient, Role } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import request from 'supertest';
import { app } from '../app';
import * as authUtils from '../utils/auth';

// Mock de PrismaClient
jest.mock('../utils/auth', () => ({
  hashPassword: jest.fn().mockReturnValue('hashed_password'),
  verifyPassword: jest.fn().mockReturnValue(true),
  generateToken: jest.fn().mockReturnValue('test_token'),
}));

const prismaMock = mockDeep<PrismaClient>();
jest.mock('../prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

describe('Auth Routes', () => {
  interface TestUser {
    id: string;
    username: string;
    password: string;
    email: string;
    fullName: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }

  let existingUser: TestUser;
  let userData: TestUser;

  beforeEach(() => {
    existingUser = {
      id: '1',
      username: 'testuser',
      password: authUtils.hashPassword('password123'),
      email: 'test@example.com',
      fullName: 'Test User',
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    userData = {
      id: '2',
      username: 'newuser',
      password: authUtils.hashPassword('password123'),
      email: 'new@example.com',
      fullName: 'New User',
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.user.create.mockResolvedValueOnce(userData);

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          email: 'new@example.com',
          fullName: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe('newuser');
    });

    it('should return 400 if username already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
          fullName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('USER_EXISTS');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(userData);

      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'newuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('newuser');
    });

    it('should return 401 with incorrect credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'wronguser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 with incorrect password', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(userData);
      jest.spyOn(authUtils, 'verifyPassword').mockReturnValueOnce(false);

      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'newuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
