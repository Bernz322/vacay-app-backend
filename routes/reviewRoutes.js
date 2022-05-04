const router = require('express').Router();

const { validateToken } = require("../middlewares/jwt")
const { createReview, deleteReview } = require("../controllers/reviewController")

router.post("/", validateToken, createReview); // Create a review. Has to pass in reservation id
router.delete("/:id", validateToken, deleteReview);    // Delete the reservation created by the current user by taking the reservation id
// Getting a review will be done inside the reservation controller

module.exports = router