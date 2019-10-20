const Blog = require('../models/blog');
var upload = require('./imagepath');


exports.blog_create = function(req, res) {
    console.log("inside blog create function");
    var fullPath = "";
    var d = Date();
    console.log(req.body.title);
    upload.single('blogimage')(req, res, (error) => {
        console.log('inside upload');
        if (req.file) {
            fullPath = "public/images/" + req.file.filename;
        } else {
            console.log('File path could not be generated');

        }
        let blog = new Blog({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            downloadLink: req.body.downloadLink,
            image: fullPath,
            imageTag: req.body.imageTag,
            createdDate: d.toString()
        });
        blog.save(function(err) {
            if (err) {
                res.send("Could not create Blog.Error :" + err);
            } else {
                res.send('Blog Created successfully')
            }
        })
    })
};


exports.blog_details = function(req, res) {
    if (req.params.id) {
        Blog.findById(req.params.id, function(err, blog) {
            if (err) return next(err);
            res.send(blog);
        })
    } else {
        var perPage = 9
        var pageNo = req.query.pagenumber;

        if (pageNo < 0 || pageNo === 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        Blog.find({})
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, blogss) {
                Blog.count().exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ blogs: blogss, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })
    }
};

exports.blog_update = function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, blog) {
        if (err) { res.send(err) } else if (blog) { res.send('Blog successfully udpated.'); } else {
            res.send('Could not find the blog id');
        }
    });
};

exports.blog_delete = function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.send("There was an error deleting the record");
        res.send('Record is Deleted successfully!');
    })
};