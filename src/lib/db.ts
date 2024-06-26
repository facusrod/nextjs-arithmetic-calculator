import { Pool } from 'pg';

const pool = new Pool({
  max: 40,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true
});

export async function query<T>(sql: string, values: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, values);
    return res.rows;
  } catch (err) {
    console.error('Error executing query: ', err);
    throw err;
  } finally {
    client.release();
  }
}

export default pool;