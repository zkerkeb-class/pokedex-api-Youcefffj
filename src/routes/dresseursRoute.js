import express from "express";
import { 
    getDresseurs, 
    getDresseur, 
    createDresseur, 
    updateDresseur, 
    deleteDresseur,
    addPokemonToDresseur,
    updateDresseurPokedex,
    updateDresseurFavoris
} from "../controllers/dresseursController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/", createDresseur);

// Routes protégées
router.get("/", authMiddleware, getDresseurs);
router.get("/:id", authMiddleware, getDresseur);
router.put("/:id", authMiddleware, updateDresseur);
router.delete("/:id", authMiddleware, deleteDresseur);
router.post("/:id/pokemon", authMiddleware, addPokemonToDresseur);
router.put("/:id/pokedex", authMiddleware, updateDresseurPokedex);
router.put("/:id/favoris", authMiddleware, updateDresseurFavoris);

export default router;