import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllUsers, blockUsers, unblockUsers, deleteUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.post("/block", authMiddleware, blockUsers);
router.post("/unblock", authMiddleware, unblockUsers);
router.delete("/delete", authMiddleware, deleteUsers);

export default router;
