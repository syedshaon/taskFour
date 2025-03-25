import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon

  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
});

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
//   idleTimeoutMillis: 300000, // Close idle connections after 30 seconds
//   connectionTimeoutMillis: 100000, // Timeout after 5 seconds if connection fails
// });

// pool.on("error", (err) => {
//   console.error("Unexpected PostgreSQL error:", err);
// });

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
