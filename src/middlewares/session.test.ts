import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import session, { DecodedToken } from './session';

jest.mock('jsonwebtoken');

describe('session middleware', () => {
  let mockHandler: jest.Mock;
  let mockReq: Partial<NextApiRequest> & { userId?: number };
  let mockRes: Partial<NextApiResponse>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockHandler = jest.fn().mockImplementation((req, res) => {
      res.status(200).json({ message: 'Success' });
    });
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    mockReq = {
      headers: {
        authorization: 'Bearer validtoken'
      }
    };
    mockRes = {
      status: mockStatus
    };
    (jwt.verify as jest.Mock).mockReset();
  });

  it('should return 401 if no token is provided', async () => {
    mockReq.headers = {};

    await session(mockHandler)(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 401 if token is invalid', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await session(mockHandler)(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 401 if token is expired', async () => {
    const expiredToken: DecodedToken = {
      userId: 1,
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) - 1
    };
    (jwt.verify as jest.Mock).mockReturnValue(expiredToken);

    await session(mockHandler)(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Token expired' });
  });

  it('should call handler if token is valid', async () => {
    const validToken: DecodedToken = {
      userId: 1,
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    (jwt.verify as jest.Mock).mockReturnValue(validToken);

    await session(mockHandler)(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockHandler).toHaveBeenCalled();
    expect(mockReq.userId).toBe(validToken.userId);
  });
});