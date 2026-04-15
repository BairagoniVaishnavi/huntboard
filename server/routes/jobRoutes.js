const express = require("express");
const router = express.Router();
const {
  getJobs, createJob, updateJob, moveJob, deleteJob, bulkDeleteJobs,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

// All job routes are protected
router.use(protect);

router.route("/")
  .get(getJobs)
  .post(createJob);

// bulk delete MUST come before /:id routes
router.delete("/bulk", bulkDeleteJobs);

router.route("/:id")
  .put(updateJob)
  .delete(deleteJob);

router.patch("/:id/move", moveJob);

module.exports = router;
