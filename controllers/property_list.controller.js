const Property_List = require('../models/property_list');
var upload = require('./imagepath');


exports.property_list_create = function(req, res) {
    console.log("inside List create function");

    var d = Date();
    upload.fields([{ name: "logo", maxCount: 1 }, { name: "coverlogo", maxCount: 1 }])(req, res, (error) => {
        var coverLogofullPath = "";
        var logofullPath = "";
        console.log('inside upload');
        console.log(req.files);
        if (req.files) {
            if (req.files['logo']) {
                logofullPath = "public/images/" + req.files['logo'][0].filename;
            }
            if (req.files['coverlogo']) {
                coverLogofullPath = "public/images/" + req.files['coverlogo'][0].filename;
            }
        } else if (error) {
            console.log('File path could not be generated');
        }
        let property_list = new Property_List({
            title: req.body.listname,
            propertyType: req.body.propertyType,
            jsonTour: req.body.jsonTour,
            propertyListType: req.body.propertyListType,
            location: req.body.location,
            amenities: JSON.parse(req.body.amenities),
            propertyTags: JSON.parse(req.body.propertyTags),
            overview: req.body.overview,
            hiraNumber: req.body.hiranumber,
            price: req.body.price,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            balconies: req.body.balconies,
            conditioning: req.body.conditioning,
            furnished: req.body.furnished,
            saleableArea: req.body.saleable,
            coverImage: coverLogofullPath,
            logo: logofullPath,
            latitude: req.body.lat,
            longitude: req.body.long,
            createdDate: d.toString()

        });
        console.log(property_list);
        property_list.save(function(err) {
            if (err) {
                console.log('error');
                console.log(err);
                return;
                // res.send("Could not create List.Error :" + err);
            } else {
                console.log('successful');
                res.send('List Created successfully')
            }
        })
    })
};


exports.property_list_details = function(req, res) {
    if (req.params.id) {
        Property_List.findById(req.params.id)
            .populate('amenities')
            .populate('propertyType')
            .populate('jsonTour')
            .populate('propertyTags')
            .exec(function(err, sites) {
                if (err) return next(err);
                res.send(sites);
            })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        Property_List.find({ disableFlag: false })
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .populate('propertyType')
            .exec(function(err, propertylist) {
                Property_List.count({ disableFlag: false }).exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ list: propertylist, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })

    }
};

exports.property_list_update = function(req, res) {

    upload.fields([{ name: "logo", maxCount: 1 }, { name: "coverlogo", maxCount: 1 }])(req, res, (error) => {
        var coverLogofullPath = "";
        var logofullPath = "";
        console.log('inside upload');
        var propertyUpdateList = {};
        if (req.files) {
            if (req.files['logo']) {
                logofullPath = "public/images/" + req.files['logo'][0].filename;
                propertyUpdateList.logo = logofullPath

            }
            if (req.files['coverlogo']) {
                coverLogofullPath = "public/images/" + req.files['coverlogo'][0].filename;
                propertyUpdateList.coverImage = coverLogofullPath

            }
        } else if (error) {
            console.log('File path could not be generated');
        }
        propertyUpdateList.title = req.body.listname;
        propertyUpdateList.propertyType = req.body.propertyType;
        propertyUpdateList.jsonTour = req.body.jsonTour;
        propertyUpdateList.propertyListType = req.body.propertyListType;
        propertyUpdateList.location = req.body.location;
        propertyUpdateList.amenities = JSON.parse(req.body.amenities);
        propertyUpdateList.propertyTags = JSON.parse(req.body.propertyTags);
        propertyUpdateList.overview = req.body.overview;
        propertyUpdateList.hiraNumber = req.body.hiranumber;
        propertyUpdateList.price = req.body.price;
        propertyUpdateList.bedrooms = req.body.bedrooms;
        propertyUpdateList.bathrooms = req.body.bathrooms;
        propertyUpdateList.balconies = req.body.balconies;
        propertyUpdateList.conditioning = req.body.conditioning;
        propertyUpdateList.furnished = req.body.furnished;
        propertyUpdateList.saleableArea = req.body.saleable;
        propertyUpdateList.latitude = req.body.lat;
        propertyUpdateList.longitude = req.body.long;
        propertyUpdateList.modifiedDate = req.body.modifiedDate;
        console.log(propertyUpdateList[0]);
        Property_List.findByIdAndUpdate(req.params.id, { $set: propertyUpdateList }, function(err, sites) {
            if (err) {
                console.log(err);
                res.send(err)
            } else if (sites) { res.send('sites successfully udpated.'); } else {
                res.send('Could not find the sites id');
            }
        });
    })
};

exports.property_list_delete = function(req, res) {
    Property_List.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, sites) {
        if (err) { res.send(err) } else if (sites) { res.send('sites successfully udpated.'); } else {
            res.send('Could not find the sites id');
        }
    })
};

exports.property_list_location_details = function(req, res) {
    var query = [];
    console.log(req.body);
    query = {
        disableFlag: false,
        "price": { $gt: req.body.lower, $lt: req.body.upper }
    }
    console.log(query);
    Property_List.find({
            disableFlag: false,
            "price": { $gt: req.body.lower, $lt: req.body.upper }
        }, ['-amenities', '-jsonTour', '-coverImage'])
        .populate(['propertyType', { path: 'propertyTags', match: { name: { $in: req.body.tags } } }])
        .exec()
        .then(function(tagPropertyList) {
            var filterTagList = (tagPropertyList.filter(propertyl => propertyl.propertyTags.length != 0));
            console.log("Total Search Tags:" + filterTagList.length);
            var userSelection = (req.body.propertyType);
            if (userSelection.length == 0) { res.send({ list: filterTagList }) } else {
                var filterPropertyList = [];
                var userSelection = (req.body.propertyType);
                for (var i = 0; i < filterTagList.length; i++) {
                    for (var j = 0; j < userSelection.length; j++) {
                        if (filterTagList[i].propertyType._id == userSelection[j]) {
                            filterPropertyList.push(filterTagList[i]);
                            break;
                        }
                    }
                }
                console.log("Total Properties:" + filterPropertyList.length);
                res.send({ list: filterPropertyList });
            }
        })
        .then(undefined, function(err) {
            console.log(err);
            res.send({ "error": true, "message": "Error fetching properties" })
        })
};

exports.property_list_user_property = function(req, res) {

    var perPage = 12
    var pageNo = req.query.pagenumber;

    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }

    Property_List.find({ disableFlag: 0 }, ['-amenities', '-jsonTour', '-coverImage', '-propertyTags'])
        .skip((perPage * pageNo) - perPage)
        .limit(perPage)
        .sort({ createdDate: 'descending' })
        .exec(function(err, propertylist) {
            Property_List.count({ disableFlag: 0 }).exec(function(err, totalcount) {
                if (err) {
                    response = { "error": true, "message": "Error fetching properties" };
                    res.send(response);
                }
                res.send({ list: propertylist, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
            })
        })

};

exports.property_list_all_user_property = function(req, res) {

    Property_List.find({ disableFlag: false }, ['-amenities', '-jsonTour', '-coverImage', '-propertyTags'])
        .exec(function(err, propertylist) {
            if (err) {
                response = { "error": true, "message": "Error fetching properties" };
                res.send(response);
            }
            res.send({ list: propertylist })
        })
};

exports.property_list_search = function(req, res) {
    var searchText = req.query.text;
    Property_List.find({ "title": new RegExp(searchText, 'i') })
        .populate('propertyType')
        .exec(function(err, propertylist) {
            if (!err) {
                res.send({ list: propertylist });
            } else {
                console.log(err);
                res.send('There was error fetching the list');
            }

        })
};