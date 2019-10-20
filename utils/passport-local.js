var passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

module.exports = function() {

    const local = new LocalStrategy((email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user || !user.validPassword(password)) {
                    done(null, false, { message: "Invalid email/password" });
                } else {
                    done(null, user);
                }
            })
            .catch(e => done(e));
    });
    passport.use("local", local);
};