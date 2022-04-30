const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");
const { calculateRemainingTables } = require("./restaurant");

exports.findAllReservations = async (req, res, next) => {
  try {
    let query;
    if (req.user.role !== "admin") {
      query = Reservation.find({ user: req.user.id }).populate({
        path: "restaurant",
        select: "name address telephone openTime closeTime",
      });
    } else {
      query = Reservation.find()
        .populate({
          path: "restaurant",
          select: "name address telephone openTime closeTime",
        })
        .populate({
          path: "user",
          select: "name email telephone",
        });
    }
    try {
      const reservations = await query;
      res.status(200).json({
        success: true,
        count: reservations.length,
        data: reservations,
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ success: false, message: "Cannot find Appointment" });
    }
  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};
exports.findReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: "Reservation not found",
      });
    }

    return res.status(200).json({
      sucess: true,
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

    //check if the user has more than 3 ongoing reservations
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
    //check if the restaurant have enough remaining tables
    if (ntable > (await calculateRemainingTables(restaurantId))) {
      return res.status(400).json({
        success: false,
        msg: `Restaurant does not have enough seats`,
      });
    }

    //check if the time in reservation is in range of opening time of the restaurant
    let reserved_hours = date.split(":")[0].slice(-2);
    let reserved_min = date.split(":")[1];
    let reserved_time = reserved_hours * 3600 + reserved_min * 60;

    let restaurant_openTime_array = restaurant.openTime.split(":");
    let restaurant_openTime =
      Number(restaurant_openTime_array[0]) * 3600 +
      Number(restaurant_openTime_array[1]) * 60;

    let restaurant_closeTime_array = restaurant.closeTime.split(":");
    let restaurant_closeTime =
      Number(restaurant_closeTime_array[0]) * 3600 +
      Number(restaurant_closeTime_array[1]) * 60;

    if (
      reserved_time < restaurant_openTime ||
      reserved_time > restaurant_closeTime
    ) {
      return res.status(400).json({
        success: false,
        msg: `The reservation time is not in range of restaurant's working time`,
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
