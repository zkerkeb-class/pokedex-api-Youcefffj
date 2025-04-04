import express from "express";
import { getUsers, createUser, login } from "../controllers/usersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", createUser);
router.post("/login", login);

// Routes protégées
router.get("/", authMiddleware, getUsers);

export default router;