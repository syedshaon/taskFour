import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected...");
  } catch (err) {
    console.error("Database connection error", err);
    process.exit(1);
  }
};

export { pool, connectDB };
