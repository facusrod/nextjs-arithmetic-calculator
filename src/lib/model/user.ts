import { hash } from 'bcrypt';
import { query as queryDb } from '../db';

export interface User {
    id: number;
    username: string;
    status: 'active' | 'inactive';
    password: string;
    user_balance: number
}

class UserModel {

    static async getById(id: number): Promise<User> {
        const query = "SELECT id, username, status, user_balance FROM users WHERE id = $1 AND status = 'active'";
        const results = await queryDb<User>(query, [id]);
        return results[0]
    }

    static async getByUsername(username: string): Promise<User> {
        const query = "SELECT id, username, password, status, user_balance FROM users WHERE username = $1 AND status = 'active'";
        const results = await queryDb<User>(query, [username]);
        return results[0]
    }

    static async createUser(username: string, password: string): Promise<User> {
        const query = 'INSERT INTO users (username, password, status, user_balance) VALUES ($1, $2, $3, $4) RETURNING id, username';
        const hashedPassword = await hash(password, 10);
        const values = [username, hashedPassword, 'active', process.env.DEFAULT_USER_BALANCE || 10];
        const results = await queryDb<User>(query, values)
        return results[0]
    }

    static async updateBalance(balance: number, userId: number): Promise<void> {
        const query = 'UPDATE users SET user_balance = $1 WHERE id = $2';
        const values = [balance, userId];
        await queryDb(query, values)
    }
}

export default UserModel;