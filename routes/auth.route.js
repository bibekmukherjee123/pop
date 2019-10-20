var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/auth/profile',
//     failureRedirect: 'auth/signup'
// }));

router.post('/authenticate', passport.authenticate('local-login', {
    successRedirect: '/admin/users',
    failureRedirect: '/admin/forbidden'
}));

router.get('/forbidden', (req, res) => {
    res.render('forbidden');
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.status(200).json({
        'message': 'successfully logout'
    });
    res.render('login');
});

router.get('/amenities', isLoggedIn, (req, res) => {
    res.render('amenities');
});
router.get('/editamenities', isLoggedIn, (req, res) => {
    if (req.query.id) {
        res.render('editamenities', { type_id: req.query.id });
    } else {
        res.render('editamenities');
    }
});

router.get('/users', isLoggedIn, (req, res) => {
    res.render('users');
});
router.get('/editusers', isLoggedIn, (req, res) => {
    if (req.query.id) {
        res.render('editusers', { userId: req.query.id })
    } else {
        res.render('editusers');
    }
});

router.get('/blog', isLoggedIn, function(req, res) {
    res.render('blog');
});
router.get('/editblog', isLoggedIn, function(req, res) {
    if (req.query.id) {
        res.render('editblog', { blogId: req.query.id })
    } else {
        res.render('editblog');
    }
});

router.get('/properties', isLoggedIn, function(req, res) {
    res.render('properties');
});
router.get('/editproperties', isLoggedIn, function(req, res) {
    if (req.query.id) {
        res.render('editproperties', { listId: req.query.id })
    } else {
        res.render('editproperties')
    }
});

router.get('/propertytypes', isLoggedIn, function(req, res) {
    res.render('propertytypes');
});
router.get('/editpropertytypes', isLoggedIn, function(req, res) {
    if (req.query.id) {
        res.render('editpropertytypes', { typeId: req.query.id });
    } else {
        res.render('editpropertytypes');
    }
});

router.get('/tags', isLoggedIn, function(req, res) {
    res.render('tags');
});
router.get('/edittags', isLoggedIn, function(req, res) {
    if (req.query.id) {
        res.render('edittags', { tagId: req.query.id })
    } else {
        res.render('edittags');
    }
});

router.get('/terms', isLoggedIn, function(req, res) {
    res.render('terms');
});
router.get('/settings', isLoggedIn, function(req, res) {
    res.render('settings');
});
router.get('/social', isLoggedIn, function(req, res) {
    res.render('social')
});
router.get('/vrupload', isLoggedIn, function(req, res) {
    res.render('vrupload');
});

router.get('/shootenquiry', isLoggedIn, function(req, res) {
    res.render('shootenquiry');
});

router.get('/propertyenquiry', isLoggedIn, function(req, res) {
    res.render('propertyenquiry');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/admin/login');
}