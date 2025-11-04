export const validateTournamentCreate = (req, res, next) => {
  const { name, mode, type, entryFee, map, date, time, maxTeams, status } = req.body || {};
  if (!name || !mode || !type || entryFee === undefined || maxTeams === undefined) {
    return res.status(400).json({ message: "Missing required fields: name, mode, type, entryFee, maxTeams" });
  }
  if (!["classic", "clash_squad"].includes(mode)) return res.status(400).json({ message: "Invalid mode" });
  if (!["solo", "duo", "squad"].includes(type)) return res.status(400).json({ message: "Invalid type" });
  if (mode === "clash_squad" && type !== "squad") return res.status(400).json({ message: "Clash Squad requires type 'squad'" });

  req.body.entryFee = Number(entryFee);
  req.body.maxTeams = Number(maxTeams);
  if (Number.isNaN(req.body.entryFee) || req.body.entryFee < 0) return res.status(400).json({ message: "entryFee must be a positive number" });
  if (!Number.isInteger(req.body.maxTeams) || req.body.maxTeams <= 0) return res.status(400).json({ message: "maxTeams must be a positive integer" });
  if (req.body.maxTeams > 25) return res.status(400).json({ message: "maxTeams cannot exceed 25" });
  if (status && !["upcoming", "completed"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  next();
};

export const validateTournamentUpdate = (req, res, next) => {
  const update = req.body || {};
  if (update.mode && !["classic", "clash_squad"].includes(update.mode)) return res.status(400).json({ message: "Invalid mode" });
  if (update.type && !["solo", "duo", "squad"].includes(update.type)) return res.status(400).json({ message: "Invalid type" });
  if (update.mode === "clash_squad" && update.type && update.type !== "squad") return res.status(400).json({ message: "Clash Squad requires type 'squad'" });
  if (update.entryFee !== undefined) {
    update.entryFee = Number(update.entryFee);
    if (Number.isNaN(update.entryFee) || update.entryFee < 0) return res.status(400).json({ message: "entryFee must be a positive number" });
  }
  if (update.maxTeams !== undefined) {
    update.maxTeams = Number(update.maxTeams);
    if (!Number.isInteger(update.maxTeams) || update.maxTeams <= 0) return res.status(400).json({ message: "maxTeams must be a positive integer" });
    if (update.maxTeams > 25) return res.status(400).json({ message: "maxTeams cannot exceed 25" });
  }
  req.body = update;
  next();
};

export const validateRegistrationCreate = (req, res, next) => {
  const { tournamentId, teamName, iglName, players, payForAll } = req.body || {};
  if (!tournamentId || !teamName || !iglName) return res.status(400).json({ message: "Missing required fields: tournamentId, teamName, iglName" });
  if (!Array.isArray(players) || players.length < 1) return res.status(400).json({ message: "players must be a non-empty array" });
  for (const p of players) {
    if (!p || !p.name || !p.inGameName || !p.playerId || !p.email || !p.upiId) {
      return res.status(400).json({ message: "Each player requires name, inGameName, playerId, email, upiId" });
    }
  }
  if (payForAll !== undefined && typeof payForAll !== "boolean") return res.status(400).json({ message: "payForAll must be boolean" });
  next();
};

export const validateJoinByCode = (req, res, next) => {
  const { name, inGameName, playerId, email, upiId } = req.body || {};
  if (!name || !inGameName || !playerId || !email || !upiId) {
    return res.status(400).json({ message: "Missing required fields: name, inGameName, playerId, email, upiId" });
  }
  next();
};

export const validateTeamOrder = (req, res, next) => {
  const { registrationId, count } = req.body || {};
  if (!registrationId) return res.status(400).json({ message: "registrationId is required" });
  if (count !== undefined) {
    const n = Number(count);
    if (!Number.isInteger(n) || n <= 0) return res.status(400).json({ message: "count must be a positive integer" });
    req.body.count = n;
  }
  next();
};

export const validatePlayerOrder = (req, res, next) => {
  const { registrationId } = req.body || {};
  if (!registrationId) return res.status(400).json({ message: "registrationId is required" });
  next();
};

export const validateVerifyPayment = (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId, scope } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId || !scope) {
    return res.status(400).json({ message: "Missing required fields for verification" });
  }
  if (!["team", "player"].includes(scope)) return res.status(400).json({ message: "Invalid scope" });
  next();
};

export const validateManualProof = (req, res, next) => {
  const { registrationId, proof } = req.body || {};
  if (!registrationId) return res.status(400).json({ message: 'registrationId is required' });
  if (!proof) return res.status(400).json({ message: 'proof (base64 image) is required' });
  next();
};

export const validateApproval = (req, res, next) => {
  const { registrationId } = req.params || {};
  if (!registrationId) return res.status(400).json({ message: 'registrationId is required' });
  next();
};
