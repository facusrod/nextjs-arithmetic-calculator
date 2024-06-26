import pool from '../db';
import { OperationType } from '../service/operation';
import OperationModel, { Operation } from './operation';

// Mock pool
jest.mock('../db', () => {
  return {
    query: jest.fn(),
  };
});

describe('OperationModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByType', () => {
    it('should return an operation by type', async () => {
      const mockOperation: Operation = {
        id: 1,
        type: 'ADDITION',
        cost: 10,
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockOperation] });

      const operation = await OperationModel.findByType(OperationType.ADDITION);
      expect(operation).toEqual(mockOperation);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, type, cost FROM operation WHERE type = $1',
        ['ADDITION']
      );
    });

    it('should return undefined if operation type does not exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const operation = await OperationModel.findByType(OperationType.MULTIPLICATION);
      expect(operation).toBeUndefined();
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, type, cost FROM operation WHERE type = $1',
        ['MULTIPLICATION']
      );
    });

    it('should throw an error if the query fails', async () => {
      const error = new Error('Database error');
      (pool.query as jest.Mock).mockRejectedValueOnce(error);

      await expect(OperationModel.findByType(OperationType.SQUARE_ROOT)).rejects.toThrow('Database error');
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, type, cost FROM operation WHERE type = $1',
        ['SQUARE_ROOT']
      );
    });
  });
});