const LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(userId, done) {
        User.findById(userId, (err, user) => done(err, user));
    });


    const local = new LocalStrategy((email, password, done) => {
        console.log(email);
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

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {

            User.findOne({ 'email': email }, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));


                return done(null, user);
            });

        }));



};