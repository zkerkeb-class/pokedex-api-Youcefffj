import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json'), 'utf8'));

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route GET de base
app.get("/api/pokemons", (req, res) => {
  res.status(200).send({
    pokemons: pokemonsList,
  });
});

// Route GET pour un pokémon spécifique
app.get("/api/pokemons/:id", (req, res) => {
  const pokemon = pokemonsList.find((pokemon) => pokemon.id === parseInt(req.params.id));
  if (!pokemon) {
    return res.status(404).send(
      {
        status: 404,
        error: "Pokémon non trouvé"
      }
    );
  }
  res.status(200).send(
    {
      status: 200,
      pokemon: pokemon
    }
  );
});

// Route Create pour un pokémon
app.post("/api/pokemons/create", (req, res) => {
  const { name, type, base } = req.body;
  if (!name || !type || !base) {
    return res.status(400).send({
      status: 400,
      error: "Les champs name, type et base sont requis"
    });
  }
  const newId = Math.max(...pokemonsList.map(p => p.id), 0) + 1;

  const newPokemon = {
    id: newId,
    name: {
      french: name.french || "",
      english: name.english || "",
      japanese: name.japanese || ""
    },
    type: Array.isArray(type) ? type : [type],
    base: base
  };

  pokemonsList.push(newPokemon);
  fs.writeFileSync(path.join(__dirname, './data/pokemons.json'), JSON.stringify(pokemonsList, null, 2));
  res.status(201).send(
    {
      status: 201,
      pokemon: newPokemon
    }
  );
});




// Route PUT pour mettre à jour un pokémon
app.put("/api/pokemons/:id", (req, res) => {
  const { name, type, base } = req.body;
  const pokemonId = parseInt(req.params.id);

  
  const pokemonIndex = pokemonsList.findIndex(p => p.id === pokemonId);
  
  if (pokemonIndex === -1) {
    return res.status(404).send({
      status: 404,
      error: "Pokémon non trouvé"
    });
  }

  const updatedPokemon = {
    ...pokemonsList[pokemonIndex],
    name: name ? {
      french: name.french || pokemonsList[pokemonIndex].name.french,
      english: name.english || pokemonsList[pokemonIndex].name.english,
      japanese: name.japanese || pokemonsList[pokemonIndex].name.japanese
    } : pokemonsList[pokemonIndex].name,
    type: type ? (Array.isArray(type) ? type : [type]) : pokemonsList[pokemonIndex].type,
    base: base ? { ...pokemonsList[pokemonIndex].base, ...base } : pokemonsList[pokemonIndex].base
  };

  // Mise à jour dans la liste
  pokemonsList[pokemonIndex] = updatedPokemon;
  
  // Sauvegarder dans le fichier
  fs.writeFileSync(path.join(__dirname, './data/pokemons.json'), JSON.stringify(pokemonsList, null, 2));
  
  res.status(200).send(updatedPokemon);
});



app.delete("/api/pokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id);
  const pokemonIndex = pokemonsList.findIndex(p => p.id === pokemonId);
  if (pokemonIndex === -1) {
    return res.status(404).send({
      status: 404,
      error: "Pokémon non trouvé"
    });
  }
  pokemonsList.splice(pokemonIndex, 1);
  fs.writeFileSync(path.join(__dirname, './data/pokemons.json'), JSON.stringify(pokemonsList, null, 2));
  res.status(200).send(
    {
      status: 200,
      message: "Pokémon supprimé avec succès"
    }
  );
});




app.get("/", (req, res) => {
  res.status(200).send("bienvenue sur l'API Pokémon");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
