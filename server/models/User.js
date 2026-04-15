const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: [true, "Name is required"], trim: true },
    email:    { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"], minlength: 8, select: false },
    jobTitle: { type: String, default: "" },
    company:  { type: String, default: "" },
    location: { type: String, default: "" },
    bio:      { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github:   { type: String, default: "" },
    joinedAt: { type: Date, default: Date.now },
    notifications: {
      followUpReminders: { type: Boolean, default: true },
      statusAlerts:      { type: Boolean, default: true },
      weeklyDigest:      { type: Boolean, default: true },
      tips:              { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain text password
userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
