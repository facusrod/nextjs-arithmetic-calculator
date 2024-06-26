import { query as queryDb } from '../db';

export interface Operation {
    id: number;
    type: string;
    cost: number;
}

class OperationModel {
    static async findByType(type: string): Promise<Operation> {
        const query = 'SELECT id, type, cost FROM operation WHERE type = $1';
        const results = await queryDb<Operation>(query, [type]);
        return results[0]
    }
}

export default OperationModel;