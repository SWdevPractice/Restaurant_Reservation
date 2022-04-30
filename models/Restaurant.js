const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please add a name"],
  },
  address: {
    type: String,
    require: [true, "Please add restaurant's address"],
  },
  telephone: {
    type: String,
    require: [true, "Please add telephone number"],
    match: [
      /^((\+66|0)(\d{9}))$/,
      "Please add a valid telephone number (0xxxxxxxxx)",
    ],
  },
  openTime: {
    type: String,
    default: "8:00",
    require: [true, "Please add opening time"],
    match: [
      /^([0-1]?[0-9]|2?[0-3]|[0-9])[:]([0-5][0-9]|[0-9])$/,
      "Please add a valid time 00:00-23:59",
    ],
  },
  closeTime: {
    type: String,
    default: "21:00",
    require: [true, "Please add closing time"],
    match: [
      /^([0-1]?[0-9]|2?[0-3]|[0-9])[:]([0-5][0-9]|[0-9])$/,
      "Please add a valid time 00:00-23:59",
    ],
  },
  ntable: {
    type: Number,
    default: 10,
  },
});

RestaurantSchema.virtual("reservations", {
  ref: "Reseravtion",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

RestaurantSchema.pre("remove", async function (next) {
  console.log(`remove reservation ${this._id}`);
  await this.model("Reservation").deleteMany({ restaurant: this._id });
  next();
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
