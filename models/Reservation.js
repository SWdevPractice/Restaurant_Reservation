const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  date: {
    type: Date,
    require: [true, "Please insert date time"],
  },
  //   time: {
  //     type: String,
  //     default: "21:00",
  //     match: [
  //       /^([0-1]?[0-9]|2?[0-3]|[0-9])[:]([0-5][0-9]|[0-9])$/,
  //       "Please add a valid time 00:00-23:59",
  //     ],
  //   },
  ntable: {
    type: Number,
    default: 1,
    require: [true, "Please add number of tables"],
  },
  status: {
    type: String,
    enum: ["Ongoing", "Complete"],
    default: "Ongoing",
  },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
