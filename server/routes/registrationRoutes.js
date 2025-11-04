import express from "express";
import {
  createRegistration,
  joinByCode,
  listRegistrationsForTournament,
  myRegistrations,
  markPaid,
  deleteRegistration,
  removePlayer,
} from "../controllers/registrationController.js";
import { protect, ownerOnly } from "../middlewares/authMiddleware.js";
import { validateRegistrationCreate, validateJoinByCode } from "../middlewares/validate.js";

const router = express.Router();

// Player
router.post("/", protect, validateRegistrationCreate, createRegistration);
router.post("/join/:teamCode", protect, validateJoinByCode, joinByCode);
router.get("/mine", protect, myRegistrations);
router.delete("/:id", protect, deleteRegistration);
router.patch("/:id/remove-player", protect, removePlayer);

// Owner
router.get("/tournament/:tournamentId", protect, ownerOnly, listRegistrationsForTournament);
router.patch("/:id/mark-paid", protect, ownerOnly, markPaid);

export default router;
