const { sign, verify } = require('jsonwebtoken')

const { User } = require('../models');

/**
 * Create a JWT token.
 * Can be decoded for checking purposes @https://jwt.io/.
 * Created token expires in 3 hour.
 * @param {Object} user 
 * @returns {Token} token
 */
const createToken = (user) => {
    return token = sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' })
}

/**
 * Middleware for validating a token. 
 * Able to protect routes that require authentication.
 * Requires a token to be sent in the cookies.
 * @returns {null} middleware
 */
const validateToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // req.headers.authorization looks like Bearer <the token>, so we split it and take the token only.
            token = req.headers.authorization.split(' ')[1];

            // Validate token
            const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET)

            // Add the complete user details from the DB to req.user
            req.user = await User.findOne({ where: { id: decoded.id }, attributes: { exclude: ['password'] } })

            next() // Continue
        } catch (error) {
            res.sendStatus(403).json({message:"Token is expired. Please re-login."}) // If something goes wrong, return 403 meaning, token is invalid 
        }
    }
    if (!token) return res.sendStatus(401).json({message:"You don't have a token. Please login properly."}) // If no token, return 401
}

module.exports = { createToken, validateToken }