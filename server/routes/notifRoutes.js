const express = require("express");
const router = express.Router();
const {
  getNotifications, markRead, markAllRead, deleteNotif, clearAll,
} = require("../controllers/notifController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/")
  .get(getNotifications)
  .delete(clearAll);

router.patch("/read-all",  markAllRead);
router.patch("/:id/read",  markRead);
router.delete("/:id",      deleteNotif);

module.exports = router;
