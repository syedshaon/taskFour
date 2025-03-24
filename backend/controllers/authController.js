import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { registerSchema, loginSchema } from "../validators/userValidator.js";

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    // Validate input
    const parsedData = registerSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [parsedData.email]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: "Email already registered" }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    // Insert into DB
    const newUser = await pool.query("INSERT INTO users (name, email, password, status) VALUES ($1, $2, $3, 'active') RETURNING id, name, email, status", [parsedData.name, parsedData.email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    // Validate input
    const parsedData = loginSchema.parse(req.body);

    // Check user existence
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [parsedData.email]);
    if (user.rowCount === 0) {
      return res.status(401).json({ message: "Invalid email or password" }); // 401 Unauthorized
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(parsedData.password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" }); // 401 Unauthorized
    }

    // Check if user is blocked
    if (user.rows[0].status === "blocked") {
      return res.status(403).json({ message: "Your account is blocked" }); // 403 Forbidden
    }

    // Update last login
    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.rows[0].id]);

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET || "fallback-secret-key", // Ensure JWT_SECRET is set
      { expiresIn: "1h" }
    );

    // Return user without password
    const { password, ...userWithoutPassword } = user.rows[0];

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAuthenticatedUser = async (req, res) => {
  try {
    const userQuery = await pool.query("SELECT id, name, email, last_login, status FROM users WHERE id = $1", [req.user.id]);

    if (userQuery.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userQuery.rows[0]); // ✅ Return user details
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, getAuthenticatedUser };
