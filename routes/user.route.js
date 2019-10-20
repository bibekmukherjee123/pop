const express = require('express');
const router = express.Router();
const passport = require('passport');

const user_controller = require('../controllers/user.controller');

// const loggedInOnly = (req, res, next) => {
//     if (req.isAuthenticated()) next();
//     else res.redirect("/login");
// };

// const loggedOutOnly = (req, res, next) => {
//     if (req.isUnauthenticated()) next();
//     else res.redirect("/");
// };

router.post('/create', user_controller.user_create);

router.get('/read/:id', user_controller.user_details);

router.get('/read', user_controller.user_details);

router.put('/update/:id', user_controller.user_update);

router.put('/delete/:id', user_controller.user_delete);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/custom/search', user_controller.user_search);


module.exports = router;