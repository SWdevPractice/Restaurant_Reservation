const express = require("express");
const { findAllReservations, findMyReservations, updateReservation, deleteReservation, createReservation} = require("../controllers/reservation");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", findAllReservations);
router.get("/me", findMyReservations);
router.post("/", createReservation);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);