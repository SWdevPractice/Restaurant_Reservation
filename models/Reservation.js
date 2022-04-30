const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    date: {
        type: Date,
        require: [true, "Please insert date"]
    }
})

module.exports = mongoose.model("Reservation", ReservationSchema);