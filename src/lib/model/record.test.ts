import pool from '../db';
import RecordModel, { TransactionError } from './record';
import { User } from './user';

// Mock the pool.query method
jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('RecordModel.insert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should insert a new record and update user balance', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      username: 'testuser',
      status: 'active',
      user_balance: 100,
      password: 'password'
    };

    (pool.query as jest.Mock).mockImplementation((query: string, values: any[]) => {
      if (query.includes('SELECT id, username, status, user_balance FROM users')) {
        return { rows: [mockUser] };
      }
      if (query.includes('UPDATE users SET user_balance')) {
        return {};
      }
      if (query.includes('INSERT INTO record')) {
        return {};
      }
      if (query.includes('BEGIN') || query.includes('COMMIT')) {
        return {};
      }
    });

    // Act
    const updatedBalance = await RecordModel.insert(1, 1, 50, 'operation result');

    // Assert
    expect(pool.query).toHaveBeenCalledTimes(5); // BEGIN, SELECT, UPDATE, INSERT, COMMIT
    expect(updatedBalance).toBe(50);
  });

  it('should throw TransactionError if user balance is 0', async () => {
    // Arrange
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      status: 'active',
      user_balance: 0,
      password: 'password'
    };

    (pool.query as jest.Mock).mockImplementation((query: string, values: any[]) => {
      if (query.includes('SELECT id, username, status, user_balance FROM users')) {
        return { rows: [mockUser] };
      }
      if (query.includes('BEGIN') || query.includes('ROLLBACK')) {
        return {};
      }
    });

    // Act & Assert
    await expect(RecordModel.insert(1, 1, 50, 'operation result')).rejects.toThrow(TransactionError);
    expect(pool.query).toHaveBeenCalledTimes(3); // BEGIN, SELECT, ROLLBACK
  });

  it('should throw TransactionError if user balance is less than the amount', async () => {
    // Arrange
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      status: 'active',
      user_balance: 30,
      password: 'password'
    };

    (pool.query as jest.Mock).mockImplementation((query: string, values: any[]) => {
      if (query.includes('SELECT id, username, status, user_balance FROM users')) {
        return { rows: [mockUser] };
      }
      if (query.includes('BEGIN') || query.includes('ROLLBACK')) {
        return {};
      }
    });

    // Act & Assert
    await expect(RecordModel.insert(1, 1, 50, 'operation result')).rejects.toThrow(TransactionError);
    expect(pool.query).toHaveBeenCalledTimes(3); // BEGIN, SELECT, ROLLBACK
  });

  it('should rollback transaction if an error occurs', async () => {
    // Arrange
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      status: 'active',
      user_balance: 100,
      password: 'password'
    };

    (pool.query as jest.Mock).mockImplementation((query: string, values: any[]) => {
      if (query.includes('SELECT id, username, status, user_balance FROM users')) {
        return { rows: [mockUser] };
      }
      if (query.includes('UPDATE users SET user_balance')) {
        throw new Error('Update balance error');
      }
      if (query.includes('BEGIN') || query.includes('ROLLBACK')) {
        return {};
      }
    });

    // Act & Assert
    await expect(RecordModel.insert(1, 1, 50, 'operation result')).rejects.toThrow('Update balance error');
    expect(pool.query).toHaveBeenCalledTimes(4); // BEGIN, SELECT, UPDATE, ROLLBACK
  });
});