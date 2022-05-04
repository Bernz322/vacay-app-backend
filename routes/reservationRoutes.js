const router = require('express').Router();
const { validateToken } = require("../middlewares/jwt")
const { createReservation, getAllUserReservation, getReservationById, deleteReservation, getRoomReservation, checkAvailability, updateReservation } = require("../controllers/reservationController")

router.post("/", validateToken, createReservation); // Create a reservation using the current user id and room id
router.post("/check", checkAvailability); // Check room availability
router.get("/reservations", validateToken, getAllUserReservation);   // Get all reservations created by the current user id
router.get("/:id", validateToken, getReservationById);    // Get an specific reservation created by the current user and that room reserved
router.get("/room/:id", validateToken, getRoomReservation);    // Get all reservations on a single room
router.put("/", validateToken, updateReservation);    // Delete the reservation created by the current user by taking the reservation id
router.delete("/:id", validateToken, deleteReservation);    // Delete the reservation created by the current user by taking the reservation id

module.exports = router