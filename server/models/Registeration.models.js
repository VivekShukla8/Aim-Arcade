import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: String,
  inGameName: String,
  playerId: String,
  email: String,
  upiId: String,
  paid: { type: Boolean, default: false },
  paymentId: String
});

const registrationSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true
  },

  teamName: String,
  iglName: String,

  players: [playerSchema],

  registeredByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: ["team", "individual"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },

  paymentId: String,

  manualPayment: {
    submitted: { type: Boolean, default: false },
    status: { type: String, enum: ['none','pending','approved','rejected'], default: 'none' },
    amount: { type: Number },
    note: { type: String },
    proof: { type: String }, // base64 data URL
    submittedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date }
  },

  paidByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  teamCode: { type: String },
  inviteLink: { type: String }
  
}, { timestamps: true });

export default mongoose.model("Registration", registrationSchema);
