/**
 * seed.js — populates MongoDB with demo user + 10 sample jobs
 * Run: npm run seed  (from root)  OR  node seed.js  (from server/)
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Job  = require("./models/Job");
const Notification = require("./models/Notification");

const sampleJobs = [
  { company: "Google",   role: "SWE Intern",          location: "Mountain View, CA", status: "interview", priority: "hot",      dateApplied: "2025-02-15", url: "https://careers.google.com",  notes: "Had a great first round. System design interview next week.", salary: "$9,000/mo" },
  { company: "Stripe",   role: "Product Intern",       location: "San Francisco, CA", status: "applied",   priority: "warm",     dateApplied: "2025-02-20", url: "https://stripe.com/jobs",     notes: "Applied via referral from college friend.",                  salary: "$8,500/mo" },
  { company: "Notion",   role: "Design Intern",        location: "Remote",            status: "offer",     priority: "hot",      dateApplied: "2025-01-28", url: "https://notion.so/careers",   notes: "Received offer! Deciding between this and Linear.",           salary: "$7,500/mo" },
  { company: "Meta",     role: "Data Analyst",         location: "Menlo Park, CA",    status: "rejected",  priority: "longshot", dateApplied: "2025-02-05", url: "https://metacareers.com",     notes: "Got a rejection after OA. Will try again next cycle.",        salary: "$10,000/mo" },
  { company: "Figma",    role: "Frontend Engineer",    location: "San Francisco, CA", status: "applied",   priority: "warm",     dateApplied: "2025-02-22", url: "https://figma.com/careers",   notes: "Dream company. Fingers crossed!",                             salary: "$130k/yr" },
  { company: "Linear",   role: "Engineering Intern",   location: "Remote",            status: "interview", priority: "hot",      dateApplied: "2025-02-10", url: "https://linear.app/careers",  notes: "Great culture fit. 2nd round scheduled for March 5.",         salary: "$8,000/mo" },
  { company: "Airbnb",   role: "UX Researcher",        location: "San Francisco, CA", status: "applied",   priority: "longshot", dateApplied: "2025-02-25", url: "https://airbnb.com/careers",  notes: "Low chance but worth trying.",                                salary: "$7,000/mo" },
  { company: "OpenAI",   role: "ML Intern",            location: "San Francisco, CA", status: "rejected",  priority: "warm",     dateApplied: "2025-02-01", url: "https://openai.com/careers",  notes: "Rejected after phone screen. Very competitive.",              salary: "$11,000/mo" },
  { company: "Vercel",   role: "Developer Advocate",   location: "Remote",            status: "applied",   priority: "warm",     dateApplied: "2025-03-01", url: "https://vercel.com/careers",  notes: "Love their product. Tailored my resume specifically.",        salary: "$120k/yr" },
  { company: "Shopify",  role: "Backend Intern",       location: "Remote",            status: "offer",     priority: "warm",     dateApplied: "2025-01-20", url: "https://shopify.com/careers", notes: "Second offer in hand. Great benefits package.",               salary: "$8,200/mo" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing demo data
    const existing = await User.findOne({ email: "demo@huntboard.app" });
    if (existing) {
      await Job.deleteMany({ userId: existing._id });
      await Notification.deleteMany({ userId: existing._id });
      await User.deleteOne({ _id: existing._id });
      console.log("🧹 Cleared existing demo user data");
    }

    // Create demo user (password will be hashed by pre-save hook)
    const user = await User.create({
      name:     "Alex Rivera",
      email:    "demo@huntboard.app",
      password: "demo1234",
      jobTitle: "CS Student & Aspiring SWE",
      company:  "UC Berkeley",
      location: "San Francisco, CA",
      bio:      "Passionate about building products. Looking for SWE internships in SF Bay Area.",
      linkedin: "linkedin.com/in/alexrivera",
      github:   "github.com/alexrivera",
      joinedAt: new Date("2025-01-15"),
    });
    console.log(`👤 Demo user created: ${user.email}`);

    // Insert jobs
    const jobs = await Job.insertMany(
      sampleJobs.map((j) => ({ ...j, userId: user._id }))
    );
    console.log(`💼 ${jobs.length} sample jobs inserted`);

    console.log("\n✅ Seed complete!");
    console.log("   Email:    demo@huntboard.app");
    console.log("   Password: demo1234\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
