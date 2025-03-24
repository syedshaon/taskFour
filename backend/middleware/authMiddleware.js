import jwt from "jsonwebtoken";
import { pool } from "../config/db.js"; // ✅ Ensure pool is imported

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization; // ✅ Safe extraction

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token
    const userQuery = await pool.query("SELECT id, status FROM users WHERE id = $1", [decoded.id]);

    if (userQuery.rowCount === 0) {
      return res.status(403).json({ message: "Forbidden: User does not exist" });
    }

    if (userQuery.rows[0].status === "blocked") {
      return res.status(403).json({ message: "Account is blocked. Please contact support." });
    }

    req.user = userQuery.rows[0]; // ✅ Attach user to `req`
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
