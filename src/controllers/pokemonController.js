import Pokemon from "../models/PokemonSchema.js";


// 🔹 Récupérer tous les Pokémons
export const getAllPokemons = async (req, res) => {
    try {
        const pokemons = await Pokemon.find().select("-_id"); // Exclure _id
        res.status(200).json({ pokemons });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des Pokémons", error });
    }
};

// 🔹 Récupérer un Pokémon par ID
export const getPokemonById = async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ id: Number(req.params.id) });
        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon non trouvé" });
        }
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du Pokémon", error });
    }
};


  