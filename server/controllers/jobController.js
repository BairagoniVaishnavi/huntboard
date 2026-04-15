const Job = require("../models/Job");

// @route  GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    // Normalize _id → id for frontend compatibility
    res.json({ jobs: jobs.map(normalize) });
  } catch (err) { next(err); }
};

// @route  POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    const { company, role, location, status, priority, dateApplied, url, notes, salary } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }
    const job = await Job.create({
      userId: req.user._id,
      company, role, location, status, priority, dateApplied, url, notes, salary,
    });
    res.status(201).json({ job: normalize(job) });
  } catch (err) { next(err); }
};

// @route  PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const allowed = ["company", "role", "location", "status", "priority", "dateApplied", "url", "notes", "salary"];
    allowed.forEach((f) => { if (req.body[f] !== undefined) job[f] = req.body[f]; });

    await job.save();
    res.json({ job: normalize(job) });
  } catch (err) { next(err); }
};

// @route  PATCH /api/jobs/:id/move
const moveJob = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ["applied", "interview", "offer", "rejected"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job: normalize(job) });
  } catch (err) { next(err); }
};

// @route  DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) { next(err); }
};

// @route  DELETE /api/jobs/bulk
const bulkDeleteJobs = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array is required" });
    }
    await Job.deleteMany({ _id: { $in: ids }, userId: req.user._id });
    res.json({ message: `${ids.length} job(s) deleted` });
  } catch (err) { next(err); }
};

// Normalize Mongoose doc: _id → id
const normalize = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.userId;
  return obj;
};

module.exports = { getJobs, createJob, updateJob, moveJob, deleteJob, bulkDeleteJobs };
