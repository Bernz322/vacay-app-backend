const router = require('express').Router()

const { getRoom, createRoom, getAllRooms, deleteRoom, getUserRooms, updateRoom } = require('../controllers/roomController')
const { validateToken } = require("../middlewares/jwt")

router.get("/", getAllRooms)    // All rooms are returned - Already in slice
router.get("/:id", getRoom)     // Get a single room based on ID - Already in slice
router.get("/user/:id", getUserRooms)     // Get all rooms of a user - Already in slice
router.post("/", validateToken, createRoom) // Create a new listing - Already in slice
router.put("/", validateToken, updateRoom)  // Update status of a listing - Already in slice
router.delete("/:id", validateToken, deleteRoom)    // Delete listing - Already in slice

module.exports = router