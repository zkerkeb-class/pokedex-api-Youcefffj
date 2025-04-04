import Users from "../models/usersSchema.js";
import bcrypt from 'bcrypt';


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

        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }

        const newUser = new Users({
            username,
            password: password
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

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Recherche de l'utilisateur
        const user = await Users.findOne({ username });
        
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Nom d'utilisateur ou mot de passe incorrect"
            });
        }

        // Vérification du mot de passe (sans bcrypt pour l'instant puisque register ne l'utilise pas)
        if (password !== user.password) {
            return res.status(401).json({
                status: 401,
                message: "Nom d'utilisateur ou mot de passe incorrect"
            });
        }

        // Format de réponse identique au register
        res.status(200).json({
            status: 200,
            message: "Connexion réussie",
            user: {
                _id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la connexion"
        });
    }
};





  