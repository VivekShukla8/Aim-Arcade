import express from "express";
import { protect, ownerOnly } from "../middlewares/authMiddleware.js";
import { createTeamOrder, createJoinOrder, verifyPayment, submitManualUpiProof, approveManualPayment, rejectManualPayment } from "../controllers/paymentController.js";
import { validateTeamOrder, validatePlayerOrder, validateVerifyPayment, validateManualProof, validateApproval } from "../middlewares/validate.js";

const router = express.Router();

router.post("/team-order", protect, validateTeamOrder, createTeamOrder);
router.post("/player-order", protect, validatePlayerOrder, createJoinOrder);
router.post("/verify", protect, validateVerifyPayment, verifyPayment);
router.post("/manual-proof", protect, validateManualProof, submitManualUpiProof);
router.post("/manual/:registrationId/approve", protect, ownerOnly, validateApproval, approveManualPayment);
router.post("/manual/:registrationId/reject", protect, ownerOnly, validateApproval, rejectManualPayment);

export default router;
