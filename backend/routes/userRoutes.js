import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllUsers, updateUserStatus } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.put("/:id/status", authMiddleware, updateUserStatus);

export default router;
