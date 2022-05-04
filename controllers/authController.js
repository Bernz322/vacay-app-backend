const bcrypt = require('bcrypt');
const { createToken } = require("../middlewares/jwt")

const { User } = require('../models');

/**
 * @desc Used to check if email is already registered.
 * @param {*} email 
 * @returns {Boolean} boolean
 */
async function isUnique(email) {
    const exists = await User.findOne({
        where: { email }
    })
    if (exists) return false
    return true
}

/**
 * @desc Register a new user and return its data with JWT token.
 * @route POST /api/auth/register
 * @access Public
 * @param {*} req.body
 * @returns {Promise} Promise
 */
const register = async (req, res) => {
    const { name, email, password, phone_number, description, profile_image } = req.body

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
                    profile_image: registerUserData.profile_image,
                    token: createToken(registerUserData)
                })
            }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong while registering. Try again." })
        }
    });
}

/**
 * @desc Login user and return its data with JWT token.
 * @route POST /api/auth/login
 * @access Public
 * @param {*} req.body 
 * @returns {Promise} Promise
 */
const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const foundUser = await User.findOne({ where: { email } })
        if (!foundUser) return res.status(404).json({ message: "Your email is not registered." })

        bcrypt.compare(password, foundUser.password, function (err, result) {
            if (err) return console.log(err);
            if (result) {
                if (foundUser.is_admin) {
                    res.status(200).json({
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email,
                        phone_number: foundUser.phone_number,
                        description: foundUser.description,
                        profile_image: foundUser.profile_image,
                        is_admin: foundUser.is_admin,
                        token: createToken(foundUser),
                        time_stamp: Date.now(),
                        expire_time: 60 * 1000 * 60 * 3, // 1000 mil * 60 sec = 1 min * 60 = 1 hr * 3 = 3hrs
                    });
                } else {
                    res.status(200).json({
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email,
                        phone_number: foundUser.phone_number,
                        description: foundUser.description,
                        profile_image: foundUser.profile_image,
                        token: createToken(foundUser),
                        time_stamp: Date.now(),
                        expire_time: 60 * 1000 * 60 * 3,
                    });
                }
            } else {
                return res.status(404).json({ message: "Wrong credentials!" })
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while logging in." })
    }
}

module.exports = { login, register }