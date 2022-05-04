const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");

exports.findAllRestaurants = async (req, res, next) => {
  try {
    let query;

    const reqQuery = {...req.query};

    //excluded fields
    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => {
      delete reqQuery[param];
    })

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Restaurant.find(JSON.parse(queryStr))
    //.populate('reservation');

    //Select
    if(req.query.select) {
      //match nosql syntax
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields)
    }

    //Sort
    if(req.query.sort) {
      //match NoSQL syntax
      const soryBy = req.query.sort.split(',').join(' ');
      query = query.sort(soryBy);
    } else {
      query = query.sort('name');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await Restaurant.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //executing query
    const restaurants = await query
    //const restaurants = await Restaurant.find();

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page+1,
        limit
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page-1,
        limit
      }
    }


    if (!restaurants) {
      res.status(400).json({
        success: false,
        msg: "restaurants not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      pagination,
      data: restaurants
    });

  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};

exports.findRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: "Restaurant not found",
      });
    }

    return res.status(200).json({
      sucess: true,
      data: restaurant,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const { name, address, telephone, openTime, closeTime, ntable } = req.body;
    const restaurant = await Restaurant.create({
      name,
      address,
      telephone,
      openTime,
      closeTime,
      ntable,
    });

    if (!restaurant) {
      res.status(500).json({
        success: false,
        msg: `Cannot create a restaurant`,
      });
    }

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(400).json({
      success: false,
      data: err.msg,
    });
  }
};

exports.calculateRemainingTables = async (restaurantId) => {
  let count = 0;

  const restaurant = await Restaurant.findById(restaurantId);
  const reservations = await Reservation.find({
    restaurant: restaurantId,
    status: "Ongoing",
  });

  reservations.forEach((reservation) => {
    count += reservation.ntable;
  });
  return restaurant.ntable - count;
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: `restaurant not found`,
      });
    }
    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      msg: `Cannot update a restaurant`,
    });
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: `restaurant not found`,
      });
    }

    await restaurant.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: `Cannot delete a restaurant`,
    });
  }
};
