import express from "express";
import {
  createTournament,
  updateTournament,
  deleteTournament,
  listTournaments,
  getTournament,
} from "../controllers/tournamentController.js";
import { protect, ownerOnly } from "../middlewares/authMiddleware.js";
import { validateTournamentCreate, validateTournamentUpdate } from "../middlewares/validate.js";

const router = express.Router();

// Public
router.get("/", listTournaments);
router.get("/:id", getTournament);

// Owner
router.post("/", protect, ownerOnly, validateTournamentCreate, createTournament);
router.patch("/:id", protect, ownerOnly, validateTournamentUpdate, updateTournament);
router.delete("/:id", protect, ownerOnly, deleteTournament);

export default router;
