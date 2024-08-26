const passport = require('passport');
const User = require('./model/User');

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://chating.dev/auth/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        // Search or create a user in your database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            // Create a new user if one doesn't exist
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.email
            });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize the user by their unique ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});