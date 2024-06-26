import { hash } from 'bcrypt';
import { query } from '../db';
import UserModel, { User } from './user';

// Mock bcrypt and pool
jest.mock('bcrypt');
jest.mock('../db', () => {
  return {
    query: jest.fn(),
  };
});

describe('UserModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        status: 'active',
        password: 'hashedpassword',
        user_balance: 100,
      };
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);

      const user = await UserModel.getById(1);
      expect(user).toEqual(mockUser);
      expect(query).toHaveBeenCalledWith(
        "SELECT id, username, status, user_balance FROM users WHERE id = $1 AND status = 'active'",
        [1]
      );
    });
  });

  describe('getByUsername', () => {
    it('should return a user by username', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        status: 'active',
        password: 'hashedpassword',
        user_balance: 100,
      };
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);

      const user = await UserModel.getByUsername('testuser');
      expect(user).toEqual(mockUser);
      expect(query).toHaveBeenCalledWith(
        "SELECT id, username, password, status, user_balance FROM users WHERE username = $1 AND status = 'active'",
        ['testuser']
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user and return the created user', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockHashedPassword = 'hashedpassword';
      (hash as jest.Mock).mockResolvedValueOnce(mockHashedPassword);
      (query as jest.Mock).mockResolvedValueOnce([mockUser]);

      const user = await UserModel.createUser('testuser', 'password');
      expect(user).toEqual(mockUser);
      expect(hash).toHaveBeenCalledWith('password', 10);
      expect(query).toHaveBeenCalledWith(
        'INSERT INTO users (username, password, status, user_balance) VALUES ($1, $2, $3, $4) RETURNING id, username',
        ['testuser', mockHashedPassword, 'active', 10]
      );
    });
  });

  describe('updateBalance', () => {
    it('should update the user balance', async () => {
      (query as jest.Mock).mockResolvedValueOnce({});

      await UserModel.updateBalance(200, 1);
      expect(query).toHaveBeenCalledWith(
        'UPDATE users SET user_balance = $1 WHERE id = $2',
        [200, 1]
      );
    });
  });
});