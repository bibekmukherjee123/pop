const SocialSettings = require('../models/social');

exports.social_create = function(req, res) {
    console.log("inside  Social create function");

    let social = new SocialSettings({
        linkedin: req.body.linkedin,
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        pinterest: req.body.pinterest,
        youtube: req.body.youtube
    });
    social.save(function(err) {
        if (err) {
            res.send("Could not create  Social.Error :" + err);
        } else {
            res.send('Social Created successfully')
        }
    })

};


exports.social_details = function(req, res) {
    SocialSettings.find({}, function(err, social) {
        if (!err) {
            res.send(social);
        } else {
            console.log(err);
            res.send('There was error fetching the records');
        }
    })

};

exports.social_update = function(req, res) {
    SocialSettings.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, social) {
        if (err) { res.send(err) } else if (social) { res.send('Settings successfully udpated.'); } else {
            res.send('Could not find the social id');
        }
    });
};