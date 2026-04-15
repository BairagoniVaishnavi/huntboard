const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type:      { type: String, enum: ["followup", "interview", "offer", "tip"], default: "tip" },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    jobId:     { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
    read:      { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
