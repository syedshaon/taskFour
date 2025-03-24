import { pool } from "../config/db.js";
import { userIdSchema, userStatusSchema } from "../validators/userValidator.js";

// ✅ Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, TO_CHAR(last_login, 'YYYY-MM-DD HH24:MI:SS') as last_login, status FROM users ORDER BY last_login DESC");

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ✅ Update user status with validation
const updateUserStatus = async (req, res) => {
  try {
    const parsedData = {
      id: req.params.id,
      status: req.body.status,
    };

    const validatedData = {
      id: userIdSchema.parse({ id: parsedData.id }).id,
      status: userStatusSchema.parse({ status: parsedData.status }).status,
    };

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [validatedData.id]);
    if (userExists.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (validatedData.status === "deleted") {
      // Hard delete from database
      await pool.query("DELETE FROM users WHERE id = $1", [validatedData.id]);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      // Update status for block/unblock
      await pool.query("UPDATE users SET status = $1 WHERE id = $2", [validatedData.status, validatedData.id]);
      return res.status(200).json({ message: `User status updated to ${validatedData.status}` });
    }
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getAllUsers, updateUserStatus };
