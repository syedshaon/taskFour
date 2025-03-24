import { pool } from "../config/db.js";

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      last_login TIMESTAMP DEFAULT NOW(),
      status VARCHAR(10) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS unique_email_idx ON users(email);
  `);
};

export { createUserTable };
