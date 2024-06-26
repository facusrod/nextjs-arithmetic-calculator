import pool from '../db';

export interface Operation {
    id: number;
    type: string;
    cost: number;
}

class OperationModel {
    static async findByType(type: string): Promise<Operation> {
        const query = 'SELECT id, type, cost FROM operation WHERE type = $1';
        const results = await pool.query(query, [type]);
        return results.rows[0]
    }
}

export default OperationModel;