import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
    id: Number,
    name: {
        english: String,
        french: String,
        japanese: String
    },
    type: [String],
    base: {
        HP: Number,
        Attack: Number,
        Defense: Number,
        "Sp. Attack": Number,
        "Sp. Defense": Number,
        Speed: Number
    },
    image: String,
    imageShiny: String
});

export default mongoose.model("Pokemon", PokemonSchema, "Pokemons");
