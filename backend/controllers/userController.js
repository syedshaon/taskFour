import { pool } from "../config/db.js";
import { userIdsSchema } from "../validators/userValidator.js";

// ✅ Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, TO_CHAR(last_login, 'YYYY-MM-DD HH24:MI:SS') as last_login, status FROM users ORDER BY last_login DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ✅ Block users
const blockUsers = async (req, res) => {
  // console.log("Block users get called");
  try {
    const { ids } = req.body;
    const validatedData = { ids: userIdsSchema.parse({ ids }).ids };

    await pool.query("UPDATE users SET status = 'blocked' WHERE id = ANY($1)", [validatedData.ids]);
    res.status(200).json({ message: "Users blocked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error blocking users", error: error.message });
  }
};

// ✅ Unblock users
const unblockUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate input
    const validatedData = userIdsSchema.parse({ ids });

    // Ensure there are valid IDs
    if (!validatedData.ids.length) {
      return res.status(400).json({ message: "Invalid user IDs provided" });
    }

    await pool.query("UPDATE users SET status = 'active' WHERE id = ANY($1)", [validatedData.ids]);

    res.status(200).json({ message: "Users unblocked successfully" });
  } catch (error) {
    res.status(400).json({ message: "Validation error", errors: error.errors });
  }
};

// ✅ Delete users
const deleteUsers = async (req, res) => {
  try {
    const { ids } = req.body;
    const validatedData = { ids: userIdsSchema.parse({ ids }).ids };

    await pool.query("DELETE FROM users WHERE id = ANY($1)", [validatedData.ids]);
    res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting users", error: error.message });
  }
};

export { getAllUsers, blockUsers, unblockUsers, deleteUsers };
