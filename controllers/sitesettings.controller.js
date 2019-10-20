const SiteSettings = require('../models/sitesettings');
var upload = require('./imagepath');


exports.sitesettings_create = function(req, res) {
    console.log("inside Sites create function");

    var d = Date();
    upload.fields([{ name: "sitelogo", maxCount: 1 }, { name: "adminlogo", maxCount: 1 }, { name: "favicon", maxCount: 1 }])(req, res, (error) => {
        console.log('inside upload');
        var sitelogofullPath = "";
        var adminlogofullPath = "";
        var faviconfullPath = "";
        if (req.files) {
            if (req.files['sitelogo']) {
                sitelogofullPath = "public/images/" + req.files['sitelogo'][0].filename;
            }
            if (req.files['adminlogo']) {
                adminlogofullPath = "public/images/" + req.files['adminlogo'][0].filename;
            }
            if (req.files['favicon']) {
                faviconfullPath = "public/images/" + req.files['favicon'][0].filename;
            }
        } else {
            console.log('File path could not be generated');
        }
        let sitesettings = new SiteSettings({
            sitename: req.body.sitename,
            sitelogo: sitelogofullPath,
            favicon: faviconfullPath,
            adminlogo: adminlogofullPath,
            adminemail: req.body.adminemail,
            siteurl: req.body.siteurl,
            contactMetaTitle: req.body.metaContactTitle,
            contactMetaDescription: req.body.metaContactDescription,
            homeMetaTitle: req.body.metaHomeTitle,
            homeMetaDescription: req.body.metaHomeDescription
        });
        sitesettings.save(function(err) {
            if (err) {
                res.send("Could not create Site Settings.Error :" + err);
            } else {
                res.send('Site Settings Created successfully');
            }
        })
    })
};


exports.sitesettings_details = function(req, res) {
    if (req.params.id) {
        SiteSettings.findById(req.params.id, function(err, sites) {
            if (err) return next(err);
            res.send(sites);
        })
    } else {
        SiteSettings.find({}, function(err, sites) {
            if (!err) {
                res.send(sites);
            } else {
                console.log(err);
                res.send('There was error fetching the records');
            }
        })
    }
};

exports.sitesettings_update = function(req, res) {
    upload.fields([{ name: "sitelogo", maxCount: 1 }, { name: "adminlogo", maxCount: 1 }, { name: "favicon", maxCount: 1 }])(req, res, (error) => {
        console.log('inside upload');
        var sitelogofullPath = "";
        var adminlogofullPath = "";
        var faviconfullPath = "";
        var settingsUpdateList = {};
        if (req.files) {
            if (req.files['sitelogo']) {
                sitelogofullPath = "public/images/" + req.files['sitelogo'][0].filename;
                settingsUpdateList.sitelogo = sitelogofullPath;
            }
            if (req.files['adminlogo']) {
                adminlogofullPath = "public/images/" + req.files['adminlogo'][0].filename;
                settingsUpdateList.adminlogo = adminlogofullPath;
            }
            if (req.files['favicon']) {
                faviconfullPath = "public/images/" + req.files['favicon'][0].filename;
                settingsUpdateList.favicon = faviconfullPath;
            }
        } else {
            console.log('File path could not be generated');
        }
        settingsUpdateList.sitename = req.body.sitename;
        settingsUpdateList.adminemail = req.body.adminemail;
        settingsUpdateList.siteurl = req.body.siteurl;
        settingsUpdateList.contactMetaTitle = req.body.metaContactTitle;
        settingsUpdateList.contactMetaDescription = req.body.metaContactDescription;
        settingsUpdateList.homeMetaTitle = req.body.metaHomeTitle;
        settingsUpdateList.homeMetaDescription = req.body.metaHomeDescription;
        settingsUpdateList.modifiedDate = req.body.modifiedDate;

        SiteSettings.findByIdAndUpdate(req.params.id, { $set: settingsUpdateList }, function(err, sites) {
            if (err) { res.send(err) } else if (sites) { res.send('sites successfully udpated.'); } else {
                res.send('Could not find the sites id');
            }
        });
    });
};