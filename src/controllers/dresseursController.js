import Dresseurs from "../models/dresseursSchema.js";

// 🔹 Récupérer tous les dresseurs
export const getDresseurs = async (req, res) => {
    try {
        const dresseurs = await Dresseurs.find().select('-password'); // Exclure le mot de passe pour la sécurité
        res.status(200).json({ 
            status: 200,
            dresseurs 
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des dresseurs:", error);
        res.status(500).json({ 
            status: 500,
            message: "Erreur lors de la récupération des dresseurs"
        });
    }
};

// 🔹 Récupérer un dresseur par son ID
export const getDresseur = async (req, res) => {
    try {
        const dresseur = await Dresseurs.findById(req.params.id);
        if (!dresseur) {
            return res.status(404).json({
                status: 404,
                message: "Dresseur non trouvé"
            });
        }
        res.status(200).json({
            status: 200,
            dresseur
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la récupération du dresseur"
        });
    }
};

// 🔹 Créer un nouveau dresseur
export const createDresseur = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Vérifier si le dresseur existe déjà
        const existingDresseur = await Dresseurs.findOne({ username });
        if (existingDresseur) {
            return res.status(400).json({
                status: 400,
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }
        
        // Créer un nouveau dresseur
        const newDresseur = new Dresseurs({
            username,
            password, // Idéalement, vous devriez hasher le mot de passe avant de l'enregistrer
            pokedex: []
        });
        
        await newDresseur.save();
        
        res.status(201).json({
            status: 201,
            message: "Dresseur créé avec succès",
            dresseur: {
                _id: newDresseur._id,
                username: newDresseur.username,
                pokedex: newDresseur.pokedex
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création du dresseur:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la création du dresseur"
        });
    }
};

// 🔹 Mettre à jour un dresseur
export const updateDresseur = async (req, res) => {
    try {
        const { username, password, pokedex } = req.body;
        
        const updatedDresseur = await Dresseurs.findByIdAndUpdate(
            req.params.id,
            { username, password, pokedex },
            { new: true }
        ).select('-password');
        
        if (!updatedDresseur) {
            return res.status(404).json({
                status: 404,
                message: "Dresseur non trouvé"
            });
        }
        
        res.status(200).json({
            status: 200,
            message: "Dresseur mis à jour avec succès",
            dresseur: updatedDresseur
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du dresseur:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la mise à jour du dresseur"
        });
    }
};

// 🔹 Ajouter un Pokémon au Pokédex d'un dresseur
export const addPokemonToDresseur = async (req, res) => {
    try {
        const { pokemonId } = req.body;
        
        // Vérifier si le pokemonId est fourni
        if (!pokemonId) {
            return res.status(400).json({
                status: 400,
                message: "L'ID du Pokémon est requis"
            });
        }
        
        const dresseur = await Dresseurs.findById(req.params.id);
        
        if (!dresseur) {
            return res.status(404).json({
                status: 404,
                message: "Dresseur non trouvé"
            });
        }
        
        // Vérifier si le Pokémon est déjà dans le Pokédex
        const pokemonExists = dresseur.pokedex.some(pokemon => pokemon.id === pokemonId);
        
        if (pokemonExists) {
            return res.status(400).json({
                status: 400,
                message: "Ce Pokémon est déjà dans le Pokédex du dresseur"
            });
        }
        
        // Ajouter le Pokémon au Pokédex
        dresseur.pokedex.push({ id: pokemonId });
        await dresseur.save();
        
        res.status(200).json({
            status: 200,
            message: "Pokémon ajouté au Pokédex avec succès",
            dresseur: {
                _id: dresseur._id,
                username: dresseur.username,
                pokedex: dresseur.pokedex
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du Pokémon au Pokédex:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de l'ajout du Pokémon au Pokédex"
        });
    }
};

// 🔹 Supprimer un dresseur
export const deleteDresseur = async (req, res) => {
    try {
        const deletedDresseur = await Dresseurs.findByIdAndDelete(req.params.id);
        
        if (!deletedDresseur) {
            return res.status(404).json({
                status: 404,
                message: "Dresseur non trouvé"
            });
        }
        
        res.status(200).json({
            status: 200,
            message: "Dresseur supprimé avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du dresseur:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la suppression du dresseur"
        });
    }
};

export const updateDresseurPokedex = async (req, res) => {
    try {
        const dresseur = await Dresseurs.findByIdAndUpdate(
            req.params.id,
            { $push: { pokedex: req.body.pokemonId } },
            { new: true }
        );
        res.status(200).json({
            status: 200,
            dresseur
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la mise à jour du pokedex"
        });
    }
};

export const updateDresseurFavoris = async (req, res) => {
    try {
        const dresseur = await Dresseurs.findById(req.params.id);
        const pokemonId = req.body.pokemonId;

        if (!dresseur) {
            return res.status(404).json({
                status: 404,
                message: "Dresseur non trouvé"
            });
        }

        // Toggle favori : ajouter si absent, retirer si présent
        if (dresseur.favoris.includes(pokemonId)) {
            dresseur.favoris = dresseur.favoris.filter(id => id !== pokemonId);
        } else {
            dresseur.favoris.push(pokemonId);
        }

        await dresseur.save();

        res.status(200).json({
            status: 200,
            dresseur
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des favoris:", error);
        res.status(500).json({
            status: 500,
            message: "Erreur lors de la mise à jour des favoris"
        });
    }
}; 