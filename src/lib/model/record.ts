import pool from '../db';
import UserModel from './user';

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

class RecordModel {
    static async insert(operationId: number, userId: number, amount: number, updateBalance: number, result: unknown): Promise<void> {
        try {
            await pool.query('BEGIN');
            // Now update the user, then insert the new operation
            await UserModel.updateBalance(updateBalance, userId);
            const query = `
                INSERT INTO record (operation_id, user_id, amount, user_balance, operation_response, date)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            const dateNow = new Date().toISOString();
            const values = [operationId, userId, amount, updateBalance, result, dateNow];
            await pool.query(query, values);
            await pool.query('COMMIT');
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
        const countResult = await pool.query(countQuery, [userId]);
        const totalRows = parseInt(countResult.rows[0].total, 10);

        const queryParams = [userId, pageSize, offset];
        const recordsResult = await pool.query(recordsQuery, queryParams);
        const records = recordsResult.rows as Record[];

        return [
            records,
            totalRows
        ];
    }

    static async delete(userId: number, recordId: number): Promise<void> {
        const query = 'UPDATE record SET deleted = $1 WHERE user_id = $2 AND id = $3';
        const dateNow = new Date().toISOString();
        const values = [dateNow, userId, recordId];
        await pool.query(query, values);
    }
}

export default RecordModel;