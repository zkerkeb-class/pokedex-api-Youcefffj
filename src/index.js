import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import usersRoutes from "./routes/usersRoute.js";
import dresseursRoutes from "./routes/dresseursRoute.js";



dotenv.config();
connectDB();

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json'), 'utf8'));
const typesList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/types.json'), 'utf8'));

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());
// Middleware pour parser le JSON
app.use(express.json());

app.use("/api/pokemons", pokemonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dresseurs", dresseursRoutes);


// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route Get les images type local
app.get("/api/types/", (req, res) => {
  res.status(200).send({
    status: 200,
    types: typesList.types
  });
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon !");
});

app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
