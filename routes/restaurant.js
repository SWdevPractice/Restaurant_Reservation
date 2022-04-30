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
router.post("/", protect, authorize("admin"), createRestaurant);
router.put("/:id", protect, authorize("admin"), updateRestaurant);
router.delete("/:id", protect, authorize("admin"), deleteRestaurant);

module.exports = router;
