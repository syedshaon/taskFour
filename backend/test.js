import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon

  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
});

const testUsers = async () => {
  try {
    console.log("🌱 testing database...");

    await pool.query("INSERT INTO users (name, email, password, status) VALUES ('Alice', 'alice@example.com', 'hashedpassword', 'active')");
    await pool.query("INSERT INTO users (name, email, password, status) VALUES ('Bob', 'alice@example.com', 'anotherhashedpassword', 'active')");

    console.log("🎉 testing complete.");
    pool.end();
  } catch (error) {
    console.error("❌ Error testing database:", error);
    pool.end();
  }
};

testUsers();
