// MODULES
const express = require("express");
const controller = require("./../controllers/tourController");

// ROUTING
const router = express.Router();

router.route("/").get(controller.getAllTours).post(controller.createTour);

router
  .route("/top-5-cheap")
  .get(controller.aliasTopTours, controller.getAllTours);

router.route("/tour-stats").get(controller.getTourStats);
router.route("/monthly-plan/:year").get(controller.getMonthlyPlan);

router
  .route("/:id")
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
