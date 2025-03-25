import express from "express";
import { getUsers, createUser } from "../controllers/usersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route publique pour l'inscription
router.post("/register", createUser);

// Routes protégées
router.get("/", authMiddleware, getUsers);

export default router;