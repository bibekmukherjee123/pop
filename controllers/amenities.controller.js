const Amenities = require('../models/amenities');
var upload = require('./imagepath');


exports.amenities_create = function(req, res) {
    console.log("inside Amenities create function");
    var fullPath = "";
    var d = Date();
    upload.single('photo')(req, res, (error) => {
        console.log('inside upload');
        if (req.file) {
            fullPath = "public/images/" + req.file.filename;
        } else {
            console.log('File path could not be generated');
        }
        let amenities = new Amenities({
            name: req.body.amenityname,
            image: fullPath,
            imageTag: req.body.imageTag,
            createdDate: d.toString()
        });
        amenities.save(function(err) {
            if (err) {
                res.send("Could not create Amenities.Error :" + err);
            } else {
                res.send('Amenities Created successfully')
            }
        })
    })
};


exports.amenities_details = function(req, res) {
    if (req.params.id) {
        Amenities.findById(req.params.id, function(err, amenities) {
            if (err) return next(err);
            res.send(amenities);
        })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        Amenities.find({ disableFlag: false })
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, amenities) {
                Amenities.count({ disableFlag: false }).exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ amenity: amenities, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })
    }
};

exports.amenities_update = function(req, res) {
    console.log(req.body);
    var amenitiesUpdateList = {};
    upload.single('photo')(req, res, (error) => {
        console.log('inside upload');
        if (req.file) {
            fullPath = "public/images/" + req.file.filename;
            amenitiesUpdateList.image = fullPath;
        } else {
            console.log('File path could not be generated');
        }
        amenitiesUpdateList.name = req.body.amenityname;
        amenitiesUpdateList.imageTag = req.body.imageTag;
        amenitiesUpdateList.modifiedDate = req.body.modifiedDate;
        console.log(amenitiesUpdateList);
        Amenities.findByIdAndUpdate(req.params.id, { $set: amenitiesUpdateList }, function(err, amenities) {
            if (err) { res.send(err) } else if (amenities) { res.send('Amenities successfully udpated.'); } else {
                res.send('Could not find the amenities id');
            }
        });
    })
};

exports.amenities_delete = function(req, res) {
    // Amenities.findByIdAndRemove(req.params.id, function(err) {
    //     if (err) res.send("There was an error deleting the record");
    //     res.send('Record was Deleted successfully!');
    // })
    Amenities.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, amenities) {
        if (err) { res.send(err) } else if (amenities) { res.send('Amenities successfully disabled.'); } else {
            res.send('Could not disable flag');
        }
    })
};

exports.amenities_list = function(req, res) {
    Amenities.find({ disableFlag: false }, function(err, amenities) {
        if (!err) {
            res.send(amenities);
        } else {
            console.log(err);
            res.send('There was error fetching the amenities');
        }
    })
}

exports.amenities_search = function(req, res) {
    var searchText = req.query.text;
    Amenities.find({ "name": new RegExp(searchText, 'i') }, function(err, amenities) {
        if (!err) {
            res.send({ amenity: amenities });
        } else {
            console.log(err);
            res.send('There was error fetching the amenities');
        }
    })
}