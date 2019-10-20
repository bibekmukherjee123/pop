const TermsConditions = require('../models/terms');

exports.terms_create = function(req, res) {
    console.log("inside  Terms create function");

    let terms = new TermsConditions({
        description: req.body.description,
    });
    terms.save(function(err) {
        if (err) {
            res.send("Could not create  Terms.Error :" + err);
        } else {
            res.send('Terms Created successfully')
        }
    })

};


exports.terms_details = function(req, res) {
    TermsConditions.find({}, function(err, terms) {
        if (!err) {
            res.send(terms);
        } else {
            console.log(err);
            res.send('There was error fetching the records');
        }
    })

};

exports.terms_update = function(req, res) {
    TermsConditions.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, terms) {
        if (err) { res.send(err) } else if (terms) { res.send('Types successfully udpated.'); } else {
            res.send('Could not find the terms id');
        }
    });
};