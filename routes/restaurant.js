const express = require("express");
const {
  findAllRestaurants,
  findRestaurantById,
} = require("../controllers/restaurant");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", findAllRestaurants);
router.get("/:id", findRestaurantById);

module.exports = router;
