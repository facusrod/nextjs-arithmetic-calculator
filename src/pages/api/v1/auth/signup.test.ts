import { NextApiRequest, NextApiResponse } from 'next';
import handler from './signup';
import UserService from '@/lib/service/user';
import jwt from 'jsonwebtoken';
import { createMocks } from 'node-mocks-http';

jest.mock('@/lib/service/user');
jest.mock('jsonwebtoken');

describe('handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 if method is not POST', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({ message: 'Method not allowed' });
  });

  it('should return 400 if username or password is missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Please provide a username and password' });
  });

  it('should return 201 and a token if user is created successfully', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { username: 'testuser', password: 'testpass' },
    });

    const mockUser = { id: 1 };
    (UserService.createUser as jest.Mock).mockResolvedValue({ data: mockUser, error: null });
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.getHeader('Authorization')).toBe('Bearer mock-token');
    expect(res._getJSONData()).toEqual({ message: 'Registration successful', token: 'mock-token' });
  });

  it('should return 500 if there is an unexpected error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { username: 'testuser', password: 'testpass' },
    });

    (UserService.createUser as jest.Mock).mockRejectedValue(new Error('Database error'));

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Unable to signup user' });
  });
});
