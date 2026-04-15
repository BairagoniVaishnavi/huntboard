const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company:     { type: String, required: [true, "Company is required"], trim: true },
    role:        { type: String, required: [true, "Role is required"], trim: true },
    location:    { type: String, default: "" },
    status:      { type: String, enum: ["applied", "interview", "offer", "rejected"], default: "applied" },
    priority:    { type: String, enum: ["hot", "warm", "longshot"], default: "warm" },
    dateApplied: { type: String, default: () => new Date().toISOString().split("T")[0] },
    url:         { type: String, default: "" },
    notes:       { type: String, default: "" },
    salary:      { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
