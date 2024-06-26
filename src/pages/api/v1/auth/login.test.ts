import { NextApiRequest, NextApiResponse } from 'next';
import handler from './login';
import UserService from '@/lib/service/user';
import jwt from 'jsonwebtoken';
import { createMocks } from 'node-mocks-http';

jest.mock('@/lib/service/user');
jest.mock('jsonwebtoken');

describe('Auth Handler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return 405 if method is not POST', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: 'Method not allowed' });
  });

  it('should return 400 if username or password is not provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Please provide username and password' });
  });

  it('should return 400 if password is invalid', async () => {
    (UserService.passIsValid as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Invalid password',
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { username: 'user', password: 'wrongpassword' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid password' });
  });

  it('should return 200 and a token if username and password are valid', async () => {
    const mockUser = { id: 1 };
    const mockToken = 'mockToken';
    (UserService.passIsValid as jest.Mock).mockResolvedValue({
      data: mockUser,
      error: null,
    });
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { username: 'user', password: 'correctpassword' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ token: mockToken });
    expect(res.getHeader('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should return 500 if an unexpected error occurs', async () => {
    (UserService.passIsValid as jest.Mock).mockRejectedValue(new Error('Test Error'));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { username: 'user', password: 'password' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Unable to login user' });
  });
});
