import Razorpay from "razorpay";
import crypto from "crypto";
import Tournament from "../models/Tournaments.models.js";
import Registration from "../models/Registeration.models.js";

const teamSizeFor = (type) => {
  if (type === "solo") return 1;
  if (type === "duo") return 2;
  return 4; // squad
};

// Submit manual UPI payment proof (base64 image) for review
export const submitManualUpiProof = async (req, res) => {
  try {
    const { registrationId, amount, note, proof } = req.body || {};
    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (reg.paymentStatus === 'paid') return res.status(400).json({ message: "Already marked paid" });

    reg.manualPayment = {
      submitted: true,
      status: 'pending',
      amount: amount ? Number(amount) : undefined,
      note: note || '',
      proof: proof || '',
      submittedByUserId: req.user?._id,
      submittedAt: new Date()
    };
    await reg.save();
    res.json({ message: 'Submitted for review', registration: reg });
  } catch (err) {
    const msg = err.message || 'Failed to submit manual proof';
    res.status(400).json({ message: msg });
  }
};

// Owner approves manual UPI proof
export const approveManualPayment = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    reg.paymentStatus = 'paid';
    reg.manualPayment = reg.manualPayment || {};
    reg.manualPayment.status = 'approved';
    // Mark all players as paid
    reg.players = reg.players.map(p => ({ ...p.toObject?.() || p, paid: true }));
    await reg.save();
    res.json({ message: 'Approved', registration: reg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Owner rejects manual UPI proof
export const rejectManualPayment = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { reason } = req.body || {};
    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    reg.manualPayment = reg.manualPayment || {};
    reg.manualPayment.status = 'rejected';
    if (reason) reg.manualPayment.note = `${reg.manualPayment.note ? reg.manualPayment.note + ' | ' : ''}Rejected: ${reason}`;
    await reg.save();
    res.json({ message: 'Rejected', registration: reg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Missing Razorpay API keys");
  }
  return new Razorpay({ key_id, key_secret });
};

// Create order for paying multiple players at once (team payment)
export const createTeamOrder = async (req, res) => {
  try {
    const { registrationId, count } = req.body; // optional count overrides players.length
    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    const t = await Tournament.findById(reg.tournamentId);
    if (!t) return res.status(404).json({ message: "Tournament not found" });

    const maxPlayers = teamSizeFor(t.type);
    const selected = Math.min(count || reg.players.length || 1, maxPlayers);

    const amount = Math.round(t.entryFee * 100 * selected); // paise

    const rz = getRazorpay();
    const shortId = String(reg._id).slice(-8);
    const shortTs = String(Date.now()).slice(-6);
    const order = await rz.orders.create({
      amount,
      currency: "INR",
      receipt: `r_${shortId}_${shortTs}`,
      notes: {
        registrationId: String(reg._id),
        scope: "team",
        selected: String(selected),
      },
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    const msg = (err && err.error && err.error.description) || err.message || 'Unable to create team order';
    res.status(400).json({ message: msg });
  }
};

// Create order for a single player joining or paying individually
export const createJoinOrder = async (req, res) => {
  try {
    const { registrationId } = req.body;
    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    const t = await Tournament.findById(reg.tournamentId);

    const amount = Math.round(t.entryFee * 100);

    const rz = getRazorpay();
    const shortId = String(reg._id).slice(-8);
    const shortTs = String(Date.now()).slice(-6);
    const order = await rz.orders.create({
      amount,
      currency: "INR",
      receipt: `rp_${shortId}_${shortTs}`,
      notes: {
        registrationId: String(reg._id),
        scope: "player",
      },
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Verify payment signature on client confirmation
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId, scope, playerEmail } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Signature verification failed" });
    }

    const reg = await Registration.findById(registrationId);
    if (!reg) return res.status(404).json({ message: "Registration not found" });

    if (scope === "team") {
      reg.paymentStatus = "paid";
      reg.paymentId = razorpay_payment_id;
      reg.paidByUserId = req.user?._id || reg.paidByUserId;
      // mark all current players as paid
      reg.players = reg.players.map(p => ({ ...p.toObject?.() || p, paid: true, paymentId: razorpay_payment_id }));
      await reg.save();
    } else {
      // mark matching player (by email) as paid
      const idx = reg.players.findIndex(p => p.email && p.email.toLowerCase() === String(playerEmail || req.user?.email || "").toLowerCase());
      if (idx === -1) return res.status(400).json({ message: "Player not found in team" });
      reg.players[idx].paid = true;
      reg.players[idx].paymentId = razorpay_payment_id;

      // If all players paid, set team paid
      const allPaid = reg.players.every(p => p.paid);
      if (allPaid) {
        reg.paymentStatus = "paid";
        reg.paymentId = razorpay_payment_id;
      }
      await reg.save();
    }

    res.json({ message: "Payment verified", registration: reg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Razorpay Webhook: server-to-server verification
// Configure webhook in Razorpay Dashboard with secret RAZORPAY_WEBHOOK_SECRET
export const webhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"]; // string
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) return res.status(500).json({ message: "Missing RAZORPAY_WEBHOOK_SECRET" });

    // req.body is a Buffer because we will use express.raw at the route level
    const bodyPayload = req.body instanceof Buffer ? req.body.toString("utf8") : JSON.stringify(req.body || {});
    const expected = crypto.createHmac("sha256", webhookSecret).update(bodyPayload).digest("hex");
    if (expected !== signature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(bodyPayload);
    // We handle order.paid and payment.captured just in case
    if (event.event === "order.paid" || event.event === "payment.captured") {
      const payload = event.payload || {};
      const order = payload.order?.entity;
      const payment = payload.payment?.entity;
      const notes = (order?.notes) || (payment?.notes) || {};
      const registrationId = notes.registrationId;
      const scope = notes.scope; // 'team' | 'player'
      const selected = Number(notes.selected || 0);

      if (registrationId) {
        const reg = await Registration.findById(registrationId).populate("tournamentId");
        if (reg) {
          if (scope === "team") {
            reg.paymentStatus = "paid";
            reg.paymentId = payment?.id || order?.id || reg.paymentId;
            reg.paidByUserId = reg.paidByUserId || undefined;
            reg.players = reg.players.map(p => ({ ...p.toObject?.() || p, paid: true, paymentId: payment?.id || p.paymentId }));
            await reg.save();
          } else {
            // player flow: we don't know which email necessarily from webhook; if notes has email, use it
            const email = notes.playerEmail;
            if (email) {
              const idx = reg.players.findIndex(p => p.email && p.email.toLowerCase() === String(email).toLowerCase());
              if (idx !== -1) {
                reg.players[idx].paid = true;
                reg.players[idx].paymentId = payment?.id || reg.players[idx].paymentId;
              }
              const allPaid = reg.players.length > 0 && reg.players.every(p => p.paid);
              if (allPaid) {
                reg.paymentStatus = "paid";
                reg.paymentId = payment?.id || reg.paymentId;
              }
              await reg.save();
            }
          }
        }
      }
    }

    // Respond 200 to acknowledge receipt
    res.json({ status: "ok" });
  } catch (err) {
    // Always respond 2xx to avoid retries storms if internal error; but log it
    console.error("Webhook error:", err);
    res.status(200).json({ status: "error", message: err.message });
  }
};





