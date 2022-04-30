const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");
const { calculateRemainingTables } = require("./restaurant");

exports.findAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();

    let query;

    if (req.user.role !== "admin") {
      query = Reservation.find({ user: req.user.id }).populate({
        path: "restaurant",
        select: "name address telephone openTime closeTime",
      });
    } else {
      query = Reservation.find().populate({
        path: "restaurant",
        select: "name address telephone openTime closeTime",
      });
    }

    if (!reservations) {
      return res.status(404).json({
        success: false,
        msg: "reservations not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};

exports.findMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.id,
    });

    if (!reservations) {
      return res.status(404).json({
        success: false,
        msg: "reservations not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: `Reservation with ID: ${req.params.id} not found`,
      });
    }

    if (
      req.user.id !== reservation.user.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        msg: `This User is not authorize to update this reservation`,
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      msg: `Cannot update a reservation`,
    });
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: `Reservation not found`,
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        msg: `This user is unauthorize to delete this reservation`,
      });
    }

    await reservation.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      msg: `Cannot delete a reservation`,
    });
  }
};

exports.createReservation = async (req, res, next) => {
  try {
    const { restaurantId, date, status, ntable } = req.body;
    const reservations = await Reservation.find({
      user: req.user.id,
      status: "Ongoing",
    });
    if (reservations.length >= 3) {
      return res.status(400).json({
        success: false,
        msg: `User cannot have more than 3 reservation`,
      });
    }
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: `Restaurant not found`,
      });
    }
    if (ntable > (await calculateRemainingTables(restaurantId))) {
      return res.status(400).json({
        success: false,
        msg: `Restaurant does not have enough seats`,
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      restaurant: restaurantId,
      date,
      status,
      ntable,
    });

    return res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};
