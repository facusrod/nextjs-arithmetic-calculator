import pool from '../db';
import RecordModel from './record';
import UserModel from './user';

jest.mock('../db');
jest.mock('./user');

describe('RecordModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('insert', () => {
        it('should insert a new record and update user balance', async () => {
            const mockQuery = jest.fn();
            pool.query = mockQuery;

            const operationId = 1;
            const userId = 1;
            const amount = 100;
            const updatedBalance = 900;
            const result = 'result';

            mockQuery.mockResolvedValueOnce({ rows: [] });
            UserModel.updateBalance = jest.fn().mockResolvedValue(true);

            await RecordModel.insert(operationId, userId, amount, updatedBalance, result);

            expect(pool.query).toHaveBeenNthCalledWith(1, 'BEGIN');
            expect(UserModel.updateBalance).toHaveBeenCalledWith(updatedBalance, userId);
            expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO record'), [operationId, userId, amount, updatedBalance, result, expect.any(String)]);
            expect(pool.query).toHaveBeenNthCalledWith(3, 'COMMIT');
        });

        it('should rollback transaction if there is an error', async () => {
            const mockQuery = jest.fn();
            pool.query = mockQuery;

            const operationId = 1;
            const userId = 1;
            const amount = 100;
            const updatedBalance = 900;
            const result = 'result';

            mockQuery.mockRejectedValueOnce(new Error('Some error'));

            await expect(RecordModel.insert(operationId, userId, amount, updatedBalance, result)).rejects.toThrow('Some error');

            expect(pool.query).toHaveBeenNthCalledWith(1, 'BEGIN');
            expect(pool.query).toHaveBeenNthCalledWith(2, 'ROLLBACK');
        });
    });

    describe('getAllByUserId', () => {
        it('should return records and total count for a user', async () => {
            const mockQuery = jest.fn();
            pool.query = mockQuery;

            const userId = 1;
            const page = 1;
            const pageSize = 10;
            const offset = page * pageSize;

            const countResult = { rows: [{ total: '20' }] };
            const recordsResult = { rows: [{ id: 1, amount: 100, operation_response: 'response', user_balance: 900, date: '2021-01-01', type: 'addition' }] };

            mockQuery.mockResolvedValueOnce(countResult);
            mockQuery.mockResolvedValueOnce(recordsResult);

            const [records, totalRows] = await RecordModel.getAllByUserId(userId, page, pageSize);

            expect(records).toEqual(recordsResult.rows);
            expect(totalRows).toBe(20);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT COUNT(*) AS total'), [userId]);
            expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT r.id, r.amount, r.operation_response, r.user_balance, r.date, o.type'), [userId, pageSize, offset]);
        });
    });

    describe('delete', () => {
        it('should mark a record as deleted', async () => {
            const mockQuery = jest.fn();
            pool.query = mockQuery;

            const userId = 1;
            const recordId = 1;
            const dateNow = new Date().toISOString();
            await RecordModel.delete(userId, recordId);
            expect(pool.query).toHaveBeenCalledWith('UPDATE record SET deleted = $1 WHERE user_id = $2 AND id = $3', [dateNow, userId, recordId]);
        });
    });
});
