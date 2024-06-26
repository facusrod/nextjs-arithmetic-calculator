import UserService from './user';
import UserModel, { User } from '../model/user';
import { compare } from 'bcrypt';

// Mocking UserModel methods
jest.mock('../model/user', () => ({
  getByUsername: jest.fn(),
  createUser: jest.fn(),
}));

// Mocking bcrypt compare function
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should return error if username already exists', async () => {
      const username = 'testuser';
      const password = 'password';

      // Mocking getByUsername to return an existing user
      (UserModel.getByUsername as jest.Mock).mockResolvedValueOnce({
        id: 1,
        username,
        password: 'hashedPassword',
        status: 1,
        user_balance: 1000,
      });

      const result = await UserService.createUser(username, password);

      expect(UserModel.getByUsername).toHaveBeenCalledWith(username);
      expect(result).toEqual({
        error: 'Username already exists',
      });
    });

    it('should create a new user if username does not exist', async () => {
      const username = 'newuser';
      const password = 'password';
      const userCreated: User = {
        id: 2,
        username,
        password: 'hashedPassword',
        status: 'active',
        user_balance: 1000,
      };

      // Mocking getByUsername to return null (no existing user)
      (UserModel.getByUsername as jest.Mock).mockResolvedValueOnce(null);

      // Mocking createUser to return the created user
      (UserModel.createUser as jest.Mock).mockResolvedValueOnce(userCreated);

      const result = await UserService.createUser(username, password);

      expect(UserModel.getByUsername).toHaveBeenCalledWith(username);
      expect(UserModel.createUser).toHaveBeenCalledWith(username, password);
      expect(result).toEqual({
        data: userCreated,
      });
    });
  });

  describe('passIsValid', () => {
    it('should return error if user not found', async () => {
      const username = 'nonexistentuser';
      const password = 'password';

      // Mocking getByUsername to return null (user not found)
      (UserModel.getByUsername as jest.Mock).mockResolvedValueOnce(null);

      const result = await UserService.passIsValid(username, password);

      expect(UserModel.getByUsername).toHaveBeenCalledWith(username);
      expect(result).toEqual({
        error: 'User not found',
      });
    });

    it('should return error if password is invalid', async () => {
      const username = 'existinguser';
      const password = 'incorrectpassword';
      const existingUser: User = {
        id: 1,
        username,
        password: 'hashedPassword',
        status: 'active',
        user_balance: 1000,
      };

      // Mocking getByUsername to return an existing user
      (UserModel.getByUsername as jest.Mock).mockResolvedValueOnce(existingUser);

      // Mocking bcrypt compare to return false (invalid password)
      (compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await UserService.passIsValid(username, password);

      expect(UserModel.getByUsername).toHaveBeenCalledWith(username);
      expect(compare).toHaveBeenCalledWith(password, existingUser.password);
      expect(result).toEqual({
        error: 'Invalid email or password',
      });
    });

    it('should return user data if password is valid', async () => {
      const username = 'existinguser';
      const password = 'correctpassword';
      const existingUser: User = {
        id: 1,
        username,
        password: 'hashedPassword',
        status: 'active',
        user_balance: 1000,
      };

      // Mocking getByUsername to return an existing user
      (UserModel.getByUsername as jest.Mock).mockResolvedValueOnce(existingUser);

      // Mocking bcrypt compare to return true (valid password)
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await UserService.passIsValid(username, password);

      expect(UserModel.getByUsername).toHaveBeenCalledWith(username);
      expect(compare).toHaveBeenCalledWith(password, existingUser.password);
      expect(result).toEqual({
        data: existingUser,
      });
    });
  });
});