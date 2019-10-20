const User = require('../models/user');
var upload = require('./imagepath');
var generator = require('generate-password');
const request = require('request')

exports.user_create = function(req, res) {
    console.log("inside user create function");
    var fullPath = "";
    var d = Date();
    upload.single('photo')(req, res, (error) => {
        console.log('inside upload');
        if (req.file) {
            fullPath = "public/images/" + req.file.filename;
        } else {
            console.log('File path could not be generated');

        }
        var email = req.body.email;
        email.toLowerCase();
        User.findOne({ 'email': email }, function(err, user) {
            if (err) { res.send(err); }
            if (user) {
                res.send('User Already Exists.Cannot create again.')
                    // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
            } else {
                var password = generator.generate({
                    length: 10,
                    numbers: true
                });
                let user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    userpassword: password,
                    mobile: req.body.mobile,
                    image: fullPath,
                    createdDate: d.toString()
                });
                console.log(user);
                user.userpassword = user.generateHash(password);
                user.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        var mailcontent = "Dear " + req.body.username + ", <br><br>Your Property 360 account has been created.Your password to login to property 360 admin is " + password + "<br><br>Thank You,<br>Property 360 Admin";
                        var mailDataObj = {
                            "email": email,
                            "subject": "Your Password for Property 360 Admin",
                            "description": mailcontent
                        };
                        request.post({
                            url: 'http://101.53.152.152:1234/mail/sendMail',
                            body: mailDataObj,
                            json: true
                        }, function(error, response, body) {

                            if (!error) {
                                console.log('Mail send Successfully');
                            } else { console.log('Mail was sent successfully') }
                        });
                        res.send('User Created successfully')
                    }
                })
            }
        })
    })
}




exports.user_details = function(req, res) {
    if (req.params.id) {
        User.findById(req.params.id, function(err, user) {
            if (err) return next(err);
            res.send(user);
        })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        User.find({ disableFlag: false })
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, users) {
                User.count({ disableFlag: false }).exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ userlist: users, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })
    }
};

exports.user_update = function(req, res) {
    var fullPath = "";
    upload.single('photo')(req, res, (error) => {
        console.log('inside update upload');
        if (req.file) {
            fullPath = "public/images/" + req.file.filename;
            req.body.image = fullPath;
        } else {
            console.log('File path could not be generated');

        }

        console.log(req.body);
        console.log(req.body.image);
        User.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, user) {
            if (err) { res.send(err) } else if (user) { res.send('User successfully udpated.'); } else {
                res.send('Could not find the user id');
            }
        });
    });
};

exports.user_delete = function(req, res) {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, user) {
        if (err) { res.send(err) } else if (user) { res.send('User Value successfuly updated.'); } else {
            res.send('Could not update the user');
        }
    })
};

exports.user_search = function(req, res) {
    var searchText = req.query.text;
    User.find({ "username": new RegExp(searchText, 'i') }, function(err, users) {
        if (!err) {
            res.send({ userlist: users });
        } else {
            console.log(err);
            res.send('There was error fetching the amenities');
        }
    })
}