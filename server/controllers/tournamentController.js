import Tournament from "../models/Tournaments.models.js";

// Owner: create tournament
export const createTournament = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user._id };
    if (payload.mode === "clash_squad" && payload.type !== "squad") {
      return res.status(400).json({ message: "Clash Squad mode only supports 'squad' type" });
    }
    const t = await Tournament.create(payload);
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Owner: update tournament
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.mode === "clash_squad" && update.type && update.type !== "squad") {
      return res.status(400).json({ message: "Clash Squad mode only supports 'squad' type" });
    }
    const t = await Tournament.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      update,
      { new: true }
    );
    if (!t) return res.status(404).json({ message: "Tournament not found" });
    res.json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Owner: delete tournament
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const t = await Tournament.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!t) return res.status(404).json({ message: "Tournament not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Public: list upcoming tournaments
export const listTournaments = async (req, res) => {
  try {
    const q = {};
    if (req.query.status && ["upcoming","completed"].includes(req.query.status)) {
      q.status = req.query.status;
    }
    const items = await Tournament.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: get tournament by id
export const getTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const t = await Tournament.findById(id);
    if (!t) return res.status(404).json({ message: "Tournament not found" });
    res.json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
