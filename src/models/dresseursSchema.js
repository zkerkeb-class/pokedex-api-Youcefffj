import mongoose from "mongoose";

const DresseursSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    username: { type: String, required: true },
    pokedex: { 
        type: [Number],  // Spécifie explicitement que c'est un tableau de nombres
        default: []
    },
    favoris: { 
        type: [Number],  // Spécifie explicitement que c'est un tableau de nombres
        default: []
    }
}, { timestamps: true });

export default mongoose.model("dresseurs", DresseursSchema); 