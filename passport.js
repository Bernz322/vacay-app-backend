const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");

const { User } = require('./models');
const { createToken } = require("./middlewares/jwt")

const CALLBACK_URL = process.env.NODE_ENV !== 'production' ? `http://localhost:8000/api/auth/google/callback` : `https://vacaycaraga.netlify.app/api/auth/google/callback`;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
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

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});