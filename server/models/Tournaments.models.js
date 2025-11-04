import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mode: {
    type: String,
    enum: ["classic", "clash_squad"],
    default: "classic",
    required: true
  },
  type: {
    type: String,
    enum: ["solo", "duo", "squad"],
    required: true
  },
  entryFee: { type: Number, required: true },
  map: { type: String, default: "Erangel" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  maxTeams: { type: Number, required: true },
  roomId: { type: String },
  roomPassword: { type: String },
  
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Tournament", tournamentSchema);
