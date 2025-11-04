import Registration from "../models/Registeration.models.js";
import Tournament from "../models/Tournaments.models.js";

const teamSizeFor = (type) => {
  if (type === "solo") return 1;
  if (type === "duo") return 2;
  return 4; // squad
};

export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    const isOwner = req.user.role === 'owner';
    const isCreator = String(reg.registeredByUserId) === String(req.user._id);
    if (!isOwner && !isCreator) return res.status(403).json({ message: 'Forbidden' });
    await Registration.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'email is required' });
    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    const isOwner = req.user.role === 'owner';
    const isCreator = String(reg.registeredByUserId) === String(req.user._id);
    const isSelf = req.user.email && String(req.user.email).toLowerCase() === String(email).toLowerCase();
    if (!isOwner && !isCreator && !isSelf) return res.status(403).json({ message: 'Forbidden' });
    const before = reg.players.length;
    reg.players = reg.players.filter(p => String(p.email||'').toLowerCase() !== String(email).toLowerCase());
    if (reg.players.length === before) return res.status(404).json({ message: 'Player not found' });
    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// Create a team registration
export const createRegistration = async (req, res) => {
  try {
    const { tournamentId, teamName, iglName, players = [], payForAll = false } = req.body;
    const t = await Tournament.findById(tournamentId);
    if (!t) return res.status(404).json({ message: "Tournament not found" });

    const maxPlayers = teamSizeFor(t.type);
    if (players.length < 1 || players.length > maxPlayers) {
      return res.status(400).json({ message: `Players must be 1 to ${maxPlayers}` });
    }

    // Enforce tournament team capacity
    const currentTeams = await Registration.countDocuments({ tournamentId });
    if (currentTeams >= t.maxTeams) {
      return res.status(400).json({ message: "Tournament is full" });
    }

    const teamCode = genCode();
    const inviteLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/join/${teamCode}`;

    const reg = await Registration.create({
      tournamentId,
      teamName,
      iglName,
      players,
      registeredByUserId: req.user._id,
      type: "team",
      paymentStatus: "pending",
      paidByUserId: payForAll ? req.user._id : undefined,
      teamCode,
      inviteLink
    });

    res.status(201).json(reg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Join a team via invite code
export const joinByCode = async (req, res) => {
  try {
    const { teamCode } = req.params;
    const { name, inGameName, playerId, email, upiId } = req.body;
    const reg = await Registration.findOne({ teamCode });
    if (!reg) return res.status(404).json({ message: "Team not found" });

    const t = await Tournament.findById(reg.tournamentId);
    const maxPlayers = teamSizeFor(t.type);
    if (reg.players.length >= maxPlayers) {
      return res.status(400).json({ message: "Team is full" });
    }

    reg.players.push({ name, inGameName, playerId, email, upiId });
    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Owner: list registrations for a tournament
export const listRegistrationsForTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const regs = await Registration.find({ tournamentId }).populate("registeredByUserId", "name email");
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Player: list my registrations
export const myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ registeredByUserId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('tournamentId');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Temporary: mark paid (will be replaced by payment webhook)
export const markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId } = req.body;
    const reg = await Registration.findByIdAndUpdate(
      id,
      { paymentStatus: "paid", paymentId },
      { new: true }
    );
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    res.json(reg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
