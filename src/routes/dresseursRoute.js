import express from "express";
import { 
    getDresseurs, 
    getDresseurById, 
    createDresseur, 
    updateDresseur, 
    deleteDresseur,
    addPokemonToDresseur
} from "../controllers/dresseursController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/", createDresseur);

// Routes protégées
router.get("/", authMiddleware, getDresseurs);
router.get("/:id", authMiddleware, getDresseurById);
router.put("/:id", authMiddleware, updateDresseur);
router.delete("/:id", authMiddleware, deleteDresseur);
router.post("/:id/pokemon", authMiddleware, addPokemonToDresseur);

export default router;