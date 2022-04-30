const express = require("express");
const { findAllReservations, findMyReservations, updateReservation, deleteReservation, createReservation} = require("../controllers/reservation");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

router.get("/", authorize('admin'), findAllReservations);
router.get("/me",protect, findMyReservations);
router.post("/", protect, createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

module.exports = router;