import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/APIuser.js";

const router = express.Router();

// 🔹 Inscription (Register)
router.post("/register",
    [
        body("username").notEmpty().withMessage("Le nom d'utilisateur est requis"),
        body("email").isEmail().withMessage("L'email est invalide"),
        body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères")
    ],
    async (req, res) => {
        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, email, password } = req.body;

            // Vérifier si l'utilisateur existe déjà
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }

            // Hacher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Créer un nouvel utilisateur
            user = new User({ username, email, password: hashedPassword });
            await user.save();

            res.status(201).json({ message: "Utilisateur créé avec succès !" });
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur", error });
        }
    }
);

// 🔹 Connexion (Login)
router.post("/login",
    [
        body("email").isEmail().withMessage("L'email est invalide"),
        body("password").notEmpty().withMessage("Le mot de passe est requis")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            // Vérifier si l'utilisateur existe
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Utilisateur non trouvé" });
            }

            // Vérifier le mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Mot de passe incorrect" });
            }

            // Générer le JWT
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" } // Token valide 1 heure
            );

            res.status(200).json({ token, message: "Connexion réussie !" });
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur", error });
        }
    }
);

export default router;
