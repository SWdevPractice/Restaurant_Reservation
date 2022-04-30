const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add a name"]
    },
    address: {
        type: String,
        require: [true, "Please add restaurant's address"]
    },
    telephone: {
        type: String,
        require: [true, "Please add telephone number"],
        match: [/^((\+66|0)(\d{9}))$/, "Please add a valid telephone number"]
    },
    openTime: {
        type: String,
        default: "08.00"
    },
    closeTime: {
        type: String,
        default: "21.00"
        //require: [true, "Please add closing time"]
    }
})

module.exports = mongoose.model("Restaurant", RestaurantSchema);