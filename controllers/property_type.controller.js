const PropertyTypes = require('../models/property_type');

exports.property_type_create = function(req, res) {
    console.log("inside Property Type create function");

    var d = Date();
    let property_type = new PropertyTypes({
        name: req.body.name,
        createdDate: d.toString()
    });
    property_type.save(function(err) {
        if (err) {
            res.send("Could not create Property Type.Error :" + err);
        } else {
            res.send('Property Type Created successfully')
        }
    })

};


exports.property_type_details = function(req, res) {
    if (req.params.id) {
        PropertyTypes.findById(req.params.id, function(err, types) {
            if (err) { res.send('There was an error fetching'); }
            res.send(types);
        })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }
        PropertyTypes.find({ disableFlag: false })
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, propertytypes) {
                PropertyTypes.count({ disableFlag: false }).exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ types: propertytypes, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })


    }
};

exports.property_type_update = function(req, res) {
    PropertyTypes.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, property_type) {
        if (err) { res.send(err) } else if (property_type) { res.send('Types successfully udpated.'); } else {
            res.send('Could not find the property id');
        }
    });
};

exports.property_type_delete = function(req, res) {
    PropertyTypes.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, property_type) {
        if (err) { res.send(err) } else if (property_type) { res.send('Types successfully udpated.'); } else {
            res.send('Could not find the property id');
        }
    })
};

exports.property_type_list = function(req, res) {
    PropertyTypes.find({ disableFlag: false }, function(err, types) {
        if (!err) {
            res.send(types);
        } else {
            console.log(err);
            res.send('There was error fetching the property types');
        }
    })
}

exports.property_type_search = function(req, res) {
    var searchText = req.query.text;
    PropertyTypes.find({ "name": new RegExp(searchText, 'i') }, function(err, propertytypes) {
        if (!err) {
            res.send({ types: propertytypes });
        } else {
            console.log(err);
            res.send('There was error fetching the types');
        }
    })
}