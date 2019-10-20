const JsonTour = require('../models/jsontour');

exports.json_tour_create = function(req, res) {
    console.log("inside Json Tour create function");

    var d = Date();
    let json_tour = new JsonTour({
        title: req.body.title,
        filepath: req.body.filePath,
        createdDate: d.toString()
    });
    json_tour.save(function(err) {
        if (err) {
            res.send("Could not create Json Tour.Error :" + err);
        } else {
            res.send('Json Tour Created successfully')
        }
    })

};


exports.json_tour_details = function(req, res) {
    if (req.params.id) {
        JsonTour.findById(req.params.id, function(err, types) {
            if (err) { res.send('There was an error fetching'); }
            res.send(types);
        })
    } else {
        JsonTour.find({}, function(err, types) {
            if (!err) {
                res.send(types);
            } else {
                console.log(err);
                res.send('There was error fetching the records');
            }
        })
    }
};

exports.json_tour_update = function(req, res) {
    JsonTour.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, jsontour) {
        if (err) { res.send(err) } else if (jsontour) { res.send('Tour successfully udpated.'); } else {
            res.send('Could not find the Json Tour id');
        }
    });
};

// exports.json_tour_delete = function(req, res) {
//     SearchTags.findByIdAndRemove(req.params.id, function(err) {
//         if (err) res.send("There was an error deleting the record");
//         res.send('Record was Deleted successfully!');
//     })
// };