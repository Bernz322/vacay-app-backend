const router = require('express').Router();
const passport = require("passport");

const { login, register, google, github } = require('../controllers/authController');

const CLIENT_URL = process.env.NODE_ENV !== 'production' ? `http://localhost:8000/auth` : `https://vacaycaraga.netlify.app/auth`;

router.post("/login", login);
router.post("/register", register);
// Google and Github OAuth2.0
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/github", passport.authenticate('github', { scope: ['profile'] }));
// OAuth Callbacks
router.get('/google/callback', passport.authenticate('google', { failureRedirect: CLIENT_URL }), google);
router.get('/github/callback', passport.authenticate('github', { failureRedirect: CLIENT_URL }), github);

module.exports = router