const ShootEnquiries = require('../models/360_enquiry');
const PropertyEnquiries = require('../models/property_enquiry');
var csv = require('csv-express');


exports.property_enquiry_create = function(req, res) {
    console.log("inside Property Enquiry create function");
    var d = Date();
    let property_enquiry = new PropertyEnquiries({
        customername: req.body.cname,
        email: req.body.email,
        mobile: req.body.mobile,
        propertyname: req.body.propertyname,
        comment: req.body.comment,
        createdDate: d.toString()
    });
    console.log(property_enquiry);
    property_enquiry.save(function(err) {
        if (err) {
            res.send("Could not create Property Enquiry.Error :" + err);
        } else {
            res.send('Property Enquiry Created successfully')
        }
    })

};


exports.property_enquiry_details = function(req, res) {
    if (req.params.id) {
        PropertyEnquiries.findById(req.params.id, function(err, enquiries) {
            if (err) { res.send('There was an error fetching'); }
            res.send(enquiries);
        })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        PropertyEnquiries.find({})
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, enquiries) {
                PropertyEnquiries.count().exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ enquiry: enquiries, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })
    }
};


exports.property_enquiry_delete = function(req, res) {
    PropertyEnquiries.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.send("There was an error deleting the record");
        res.send('Record was Deleted successfully!');
    })
};

exports.property_enquiry_search = function(req, res) {
    var searchText = req.query.text;
    var regExp = new RegExp(searchText, 'i');
    if (isNaN(req.query.text) == false) {
        var query = { $or: [{ "customername": regExp }, { "mobile": parseInt(req.query.text) }, { "email": regExp }] };
    } else { var query = { $or: [{ "customername": regExp }, { "email": regExp }] } }
    PropertyEnquiries.find(query, function(err, enquiries) {
        if (!err) {
            res.send({ enquiries: enquiries });
        } else {
            console.log(err);
            res.send('There was error fetching the enquiries');
        }
    })
}


exports.property_generate_csv = function(req, res) {
    console.log('csv generaion');
    PropertyEnquiries.find({})
        .lean()
        .exec(function(err, enquiries) {
            if (err) res.send(err);
            var filename = "propertyenquiries.csv";
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
            console.log(enquiries);
            res.csv(enquiries, true);

        })
}

exports.shoot_enquiry_create = function(req, res) {
    console.log("inside Shoot Enquiry create function");

    var d = Date();
    let shoot_enquiry = new ShootEnquiries({
        customername: req.body.cname,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        createdDate: d.toString()
    });
    shoot_enquiry.save(function(err) {
        if (err) {
            res.send("Could not create Property Enquiry.Error :" + err);
        }
        res.send('Property Enquiry Created successfully')
    })

};


exports.shoot_enquiry_details = function(req, res) {
    if (req.params.id) {
        ShootEnquiries.findById(req.params.id, function(err, enquiries) {
            if (err) { res.send('There was an error fetching'); }
            res.send(enquiries);
        })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        ShootEnquiries.find({})
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, enquiries) {
                ShootEnquiries.count().exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ enquiry: enquiries, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })
    }
};


exports.shoot_enquiry_delete = function(req, res) {
    ShootEnquiries.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.send("There was an error deleting the record");
        res.send('Record was Deleted successfully!');
    })
};

exports.shoot_enquiry_search = function(req, res) {
    var searchText = req.query.text;
    var regExp = new RegExp(searchText, 'i');
    if (isNaN(req.query.text) == false) {
        var query = { $or: [{ "customername": regExp }, { "mobile": parseInt(req.query.text) }, { "email": regExp }] };
    } else { var query = { $or: [{ "customername": regExp }, { "email": regExp }] } }
    ShootEnquiries.find(query, function(err, enquiries) {
        if (!err) {
            res.send({ enquiries: enquiries });
        } else {
            console.log(err);
            res.send('There was error fetching the enquiries');
        }
    })
}

exports.shoot_generate_csv = function(req, res) {
    ShootEnquiries.find({})
        .lean()
        .exec(function(err, enquiries) {
            if (err) res.send(err);
            var filename = "shootenquiries.csv";
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
            console.log(enquiries);
            res.csv(enquiries, true);
        })
}