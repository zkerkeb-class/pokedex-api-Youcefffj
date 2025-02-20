import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Route d'inscription
router.post("/register", 
    [
        body("username").notEmpty().withMessage("Le nom d'utilisateur est requis"),
        body("email").isEmail().withMessage("L'email est invalide"),
        body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères")
    ], 
    registerUser
);

// Route de connexion
router.post("/login", 
    [
        body("email").isEmail().withMessage("L'email est invalide"),
        body("password").notEmpty().withMessage("Le mot de passe est requis")
    ], 
    loginUser
);

export default router;
