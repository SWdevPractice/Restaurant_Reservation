const express = require("express");
const {
  findAllReservations,
  updateReservation,
  deleteReservation,
  createReservation,
  findReservationById,
} = require("../controllers/reservation");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", protect, findAllReservations);
router.get("/:id", protect, findReservationById);
router.post("/", protect, authorize("user"), createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

module.exports = router;
