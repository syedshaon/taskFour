import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
import { hash } from "bcrypt";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Generate users from "aaa" to "zzz"
const users = [];
for (let charCode = 97; charCode <= 122; charCode++) {
  const letter = String.fromCharCode(charCode); // 'a' to 'z'
  const name = `${letter.repeat(2)} ${letter.repeat(3)}`;
  const email = `john${letter.repeat(2)}@gmail.com`;
  const password = letter.repeat(2);

  users.push({ name, email, password });
}

const seedUsers = async () => {
  try {
    console.log("🌱 Seeding database...");

    for (const user of users) {
      const hashedPassword = await hash(user.password, 10);
      await pool.query("INSERT INTO users (name, email, password, status) VALUES ($1, $2, $3, 'active') ON CONFLICT (email) DO NOTHING", [user.name, user.email, hashedPassword]);
      console.log(`✅ Inserted: ${user.email}`);
    }

    console.log("🎉 Seeding complete.");
    pool.end();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    pool.end();
  }
};

seedUsers();
