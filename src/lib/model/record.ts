import pool, { query as queryDb } from '../db';
import { User } from './user';
export interface Record {
    id: number,
    operation_id: number,
    user_id: number;
    amount: number;
    operation_response: string;
    user_balance: number;
    date: string
    deleted: boolean;
}

export class TransactionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TransactionError';
    }
}

class RecordModel {
    static async insert(operationId: number, userId: number, amount: number, operationResult: unknown): Promise<number> {
        try {
            await pool.query('BEGIN');

            const getUserQuery = "SELECT id, username, status, user_balance FROM users WHERE id = $1 AND status = 'active' FOR UPDATE";
            const results = await pool.query(getUserQuery, [userId]);
            
            const user = results.rows[0] as User
            if (user.user_balance <= 0) {
                throw new TransactionError('Err. User balance must be greater than 0')
            }
            const updatedBalance = user.user_balance - amount;
            if (updatedBalance < 0) {
                throw new TransactionError(`Err. Operation cost: ${amount}. Your balance: ${user.user_balance}`);
            }

            // Now update the user, then insert the new operation
            const updateBalanceQuery = 'UPDATE users SET user_balance = $1 WHERE id = $2';
            await pool.query(updateBalanceQuery, [updatedBalance, userId])

            const query = `
                INSERT INTO record (operation_id, user_id, amount, user_balance, operation_response, date)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            const dateNow = new Date().toISOString();
            const values = [operationId, userId, amount, updatedBalance, operationResult, dateNow];
            await pool.query(query, values);
            await pool.query('COMMIT');

            return updatedBalance;
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }

    static async getAllByUserId(
        userId: number,
        page: number = 1,
        pageSize: number = 10
      ): Promise<[Record[], number]> {
        // Calculate the offset based on the current page and page size
        const offset = page * pageSize;
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM record
            WHERE user_id = $1
            AND deleted IS NULL
        `;

        const recordsQuery = `
            SELECT r.id, r.amount, r.operation_response, r.user_balance, r.date, o.type 
            FROM record r 
            LEFT JOIN operation o 
            ON r.operation_id = o.id 
            WHERE r.user_id = $1 
            AND r.deleted IS NULL 
            ORDER BY r.date DESC 
            LIMIT $2 OFFSET $3
        `;
        const countResult = await queryDb(countQuery, [userId]);
        const totalRows = parseInt((countResult[0] as any).total, 10);

        const queryParams = [userId, pageSize, offset];
        const records = await queryDb<Record>(recordsQuery, queryParams);
        return [
            records,
            totalRows
        ];
    }

    static async delete(userId: number, recordId: number): Promise<void> {
        const query = 'UPDATE record SET deleted = $1 WHERE user_id = $2 AND id = $3';
        const dateNow = new Date().toISOString();
        const values = [dateNow, userId, recordId];
        await queryDb(query, values);
    }
}

export default RecordModel;