import Users from "../models/usersSchema.js";
import bcrypt from "bcrypt";


// 🔹 Récupérer tous les users
export const getUsers = async (req, res) => {
    try {
        const users = await Users.find().select('-password'); // Exclure le mot de passe pour la sécurité
        res.status(200).json({ 
            status: 200,
            users 
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des users:", error);
        res.status(500).json({ 
            status: 500,
            message: "Erreur lors de la récupération des users"
        });
    }
};

// 🔹 Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer le nouvel utilisateur
        const newUser = new Users({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            status: 201,
            message: "Utilisateur créé avec succès",
            user: {
                _id: newUser._id,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la création de l'utilisateur"
        });
    }
};





  