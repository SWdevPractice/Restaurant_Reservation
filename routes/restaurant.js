const express = require("express");
const {
  findAllRestaurants,
  findRestaurantById,
  createRestaurant,
} = require("../controllers/restaurant");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", findAllRestaurants);
router.get("/:id", findRestaurantById);
router.post("/", createRestaurant);

module.exports = router;
