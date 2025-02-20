import express from "express";
import { getAllPokemons, getPokemonById } from "../controllers/pokemonController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", authMiddleware, getAllPokemons);
router.get("/:id", getPokemonById);

export default router;
