const Notification = require("../models/Notification");
const Job = require("../models/Job");

// Auto-generate notifications from jobs (called on first fetch)
const generateForUser = async (userId) => {
  const jobs = await Job.find({ userId });
  const now = new Date();
  const notifs = [];

  for (const job of jobs) {
    const applied = new Date(job.dateApplied);
    const daysSince = Math.floor((now - applied) / 86400000);

    if (job.status === "applied" && daysSince >= 7) {
      notifs.push({
        userId, type: "followup",
        title: "Follow-up reminder",
        message: `It's been ${daysSince} days since you applied to ${job.company}. Time to follow up!`,
        jobId: job._id,
        timestamp: new Date(now - Math.random() * 3600000),
      });
    }
    if (job.status === "interview") {
      notifs.push({
        userId, type: "interview",
        title: "Interview in progress",
        message: `You have an interview underway at ${job.company} for ${job.role}. Good luck!`,
        jobId: job._id,
        timestamp: new Date(now - Math.random() * 7200000),
      });
    }
    if (job.status === "offer") {
      notifs.push({
        userId, type: "offer",
        title: "🎉 Offer received!",
        message: `Congratulations! You received an offer from ${job.company}. Review and respond soon.`,
        jobId: job._id,
        timestamp: new Date(now - Math.random() * 1800000),
      });
    }
  }

  notifs.push({
    userId, type: "tip",
    title: "💡 Pro tip",
    message: "Personalizing your cover letter increases callback rates by up to 30%. Try referencing a specific company initiative.",
    timestamp: new Date(now - 86400000),
  });

  notifs.push({
    userId, type: "tip",
    title: "📊 Weekly digest",
    message: `You have ${jobs.length} applications tracked. Keep going!`,
    timestamp: new Date(now - 172800000),
  });

  await Notification.insertMany(notifs);
};

// @route  GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id });

    // First-time: auto-generate contextual notifications
    if (count === 0) {
      await generateForUser(req.user._id);
    }

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    res.json({
      notifications: notifications.map((n) => ({
        ...n,
        id: n._id.toString(),
        jobId: n.jobId ? n.jobId.toString() : null,
      })),
    });
  } catch (err) { next(err); }
};

// @route  PATCH /api/notifications/:id/read
const markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    res.json({ message: "Marked as read" });
  } catch (err) { next(err); }
};

// @route  PATCH /api/notifications/read-all
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { read: true });
    res.json({ message: "All marked as read" });
  } catch (err) { next(err); }
};

// @route  DELETE /api/notifications/:id
const deleteNotif = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Notification deleted" });
  } catch (err) { next(err); }
};

// @route  DELETE /api/notifications
const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: "All notifications cleared" });
  } catch (err) { next(err); }
};

module.exports = { getNotifications, markRead, markAllRead, deleteNotif, clearAll };
