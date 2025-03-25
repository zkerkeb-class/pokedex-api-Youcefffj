import mongoose from "mongoose";

const DresseurSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pokedex: [
        {
            id: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

export default mongoose.model("dresseurs", DresseurSchema); 