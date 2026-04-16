const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

// NEW
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(o => o.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/jobs",          require("./routes/jobRoutes"));
app.use("/api/notifications", require("./routes/notifRoutes"));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// Serve client build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"))
  );
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n HuntBoard server  →  http://localhost:${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || "development"}\n`);
});
