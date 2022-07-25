const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");

const { User } = require('./models');

const GOOGLE_CALLBACK_URL = process.env.NODE_ENV !== 'production' ? `http://localhost:8000/api/auth/google/callback` : `https://vacay-backend-jeff.herokuapp.com/api/auth/google/callback`;
const GITHUB_CALLBACK_URL = process.env.NODE_ENV !== 'production' ? `http://localhost:8000/api/auth/github/callback` : `https://vacay-backend-jeff.herokuapp.com/api/auth/github/callback`;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, cb) {
        // Check if user is already registered
        const exists = await User.findOne({
            where: { email: profile._json.email }
        }).catch(function (err) {
            return cb(err)
        });

        // If no, then register
        if (!exists) {
            const registerUserData = await User.create({
                name: profile._json.name,
                email: profile._json.email,
                description: "Registered using Google OAuth",
                profile_image: profile._json.picture,
            }).catch(function (err) {
                return cb(err)
            });

            if (registerUserData) {
                return cb(null, registerUserData)
            }
        } else {
            // If yes, then log in
            return cb(null, exists)
        }
    }
));

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, cb) {
            // Check if user is already registered
            const exists = await User.findOne({
                where: { email: profile._json.email }
            }).catch(function (err) {
                return cb(err)
            });

            // If no, then register
            if (!exists) {
                const registerUserData = await User.create({
                    name: profile._json.name,
                    email: profile._json.email,
                    description: "Registered using Github OAuth",
                    profile_image: profile._json.avatar_url,
                }).catch(function (err) {
                    return cb(err)
                });

                if (registerUserData) {
                    return cb(null, registerUserData)
                }
            } else {
                // If yes, then log in
                return cb(null, exists)
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});