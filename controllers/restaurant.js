const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");

exports.findAllRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();
        if(!restaurants) {
            res.status(400).json({
                success: false,
                msg: "restaurants not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: restaurants
        });

    } catch(err) {
        console.log(err.stack);
        return res.status(400).json({
            success: false,
            data: err.message
        })
        
    }
}

exports.findRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                msg: "Restaurant not found"
            })
        }

        return res.status(200).json({
            sucess: true,
            data: restaurant
        })

    } catch(err) {
        console.log(err.stack);
        return res.status(400).json({
            success: false,
            data: err.message
        })
    }
}

exports.createRestaurant = async (req, res, next) => {
    try {
        const { name, address, telephone, openTime, closeTime, ntable } = req.body;

        const restaurant = await Restaurant.create({
            name,
            address,
            telephone,
            openTime,
            closeTime,
            ntable
        })

        if(!restaurant) {
            res.status(500).json({
                success: false,
                msg: `Cannot create a restaurant`
            })
        }

        res.status(201).json({
            success: true,
            data: restaurant
        })
    
    } catch (err) {
        console.log(err.stack);
        return res.status(400).json({
            success: false,
            data: err.msg
        })
    }
}

async function calculateRemainingTables(restaurantId) {
    let count = 0;
    
    const restaurant = await Restaurant.findById(restaurantId);
    const reservations = await Reservation.find({
        restaurant: restaurantId,
        status: "Ongoing"
    });
    
    reservations.forEach(reservation => {
        count += reservation.ntable
    });

    return restaurant.ntable - count;
}
