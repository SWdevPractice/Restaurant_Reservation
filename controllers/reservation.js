const Reservation = require("../models/Reservation");

exports.findAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find();
        
        if(!reservations) {
            return res.status(404).json({
                success: false,
                msg: "reservations not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: reservations
        })

    } catch (err) {
        console.log(err.stack);
        return res.status(400).json({
            success: false,
            data: err.message
        })
    }
}

exports.findMyReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({
            user: req.user.id
        })

        if (!reservations) {
            return res.status(404).json({
                success: false,
                msg: "reservations not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: reservations
        })

    } catch (err) {
        console.log(err.stack);
        return res.status(400).json({
            success: false,
            data: err.message
        })
    }
}

exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation) {
            return res.status(404).json({
                success: false,
                msg: `Reservation with ID: ${req.params.id} not found`
            })
        }

        if()
    } catch (err) {
        console.log(err.stack);
        return res.status(400).json({
            success: false,
            data: err.msg
        })
    }
}