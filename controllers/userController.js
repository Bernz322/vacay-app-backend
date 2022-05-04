const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');

const { User, Room, Reservation } = require('../models');

async function isUnique(email) {
    const exists = await User.findOne({
        where: { email }
    })
    if (exists) return false
    return true
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll()
        if (!allUsers) return res.status(200).json({ message: "No app users." })

        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching all users." })
    }
}

const getUserProfilebyID = async (req, res) => {
    const userId = req.params.id
    console.log(userId)

    try {
        const foundUser = await User.findOne({
            where: { id: userId }, attributes: { exclude: ['password'] }, include: [
                { model: Room, include: [Reservation] },
                { model: Reservation }
            ]
        })

        if (!foundUser) return res.status(404).json({ message: "User not found." })

        res.status(200).json(foundUser)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching the user." })
        console.log(error);
    }
}

const currentUserProfile = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "Your profile is not found. Please login properly." })
    res.status(200).json(req.user)
}

const addUser = async (req, res) => {
    // Admin route only
    const { name, email, password, phone_number, description, profile_image } = req.body
    const currentUser = req.user

    if (!currentUser.is_admin) return res.status(401).json({ message: "Only admins can access this route" })

    const uniqueChecker = await isUnique(email)

    if (!uniqueChecker) {
        return res.status(400).json({ message: "Email is already taken." })
    }

    bcrypt.hash(password, 10, async function (err, hash) {
        try {
            const registerUserData = await User.create({
                name,
                email,
                password: hash,
                phone_number,
                description,
                profile_image,
            })

            if (registerUserData) {
                res.status(200).json({
                    id: registerUserData.id,
                    name: registerUserData.name,
                    email: registerUserData.email,
                    phone_number: registerUserData.phone_number,
                    description: registerUserData.description,
                    profile_image: registerUserData.profile_image
                })
            }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong while creating the user. Try again." })
            console.log(error);
        }
    });
}

const updateUser = async (req, res) => {
    // Admin route only
    const { id, phone_number, description } = req.body
    const currentUser = req.user

    if (!currentUser.is_admin && id !== currentUser.id) return res.status(401).json({ message: "You can only update your own profile." })

    try {
        const foundUser = await User.findOne({ where: { id } })
        if (!foundUser) return res.status(404).json({ message: "User not found." })

        if (phone_number) foundUser.phone_number = phone_number
        if (description) foundUser.description = description

        const updatedUser = await foundUser.save()
        return res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while updating the user." })
    }
}

const deleteUser = async (req, res) => {
    // Admin route only
    const userId = req.params.id

    try {
        const foundUser = await User.findOne({ where: { id: userId } })

        if (!foundUser) return res.status(404).json({ message: "User not found!" })

        await User.destroy({ where: { id: userId } })
        res.json({ message: "User deleted successfully." })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting the room." })
    }
}

module.exports = { getAllUsers, getUserProfilebyID, currentUserProfile, addUser, updateUser, deleteUser }