const express = require("express");
const {
  findAllRestaurants,
  findRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

router.get("/", findAllRestaurants);
router.get("/:id", findRestaurantById);
router.post("/", authorize("admin"), createRestaurant);
router.put("/:id", authorize("admin"), updateRestaurant);
router.delete("/:id", authorize("admin"), deleteRestaurant)

module.exports = router;
