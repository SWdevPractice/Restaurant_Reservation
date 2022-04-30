const Restaurant = require("../models/Restaurant");

exports.findAllRestaurants = async (req, res, next) => {
    try {
        let query;

        const reqQuery = {...req.query};

        //exclude fields
        const removeFields = ['select', 'sort', 'page', 'limit'];

        removeFields.forEach(param => {
            delete reqQuery[param];
        });


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

