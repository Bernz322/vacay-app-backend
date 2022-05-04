const router = require('express').Router();

const { getAllUsers, getUserProfilebyID, currentUserProfile, updateUser, addUser, deleteUser } = require('../controllers/userController');
const { validateToken } = require("../middlewares/jwt")

router.get("/profile/:id", getUserProfilebyID);
router.get("/me", validateToken, currentUserProfile);
router.get("/", getAllUsers);
router.post("/", validateToken, addUser);
router.put("/", validateToken, updateUser);
router.delete("/:id", validateToken, deleteUser);

module.exports = router