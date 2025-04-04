import mongoose from "mongoose";

const DresseursSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    username: { type: String, required: true },
    pokedex: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pokemons' }],
    favoris: [{ type: Number }] // IDs des pokémons favoris
}, { timestamps: true });

export default mongoose.model("dresseurs", DresseursSchema); 