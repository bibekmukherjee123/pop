const SearchTags = require('../models/searchtags');

exports.search_tags_create = function(req, res) {
    console.log("inside Search Tags create function");

    var d = Date();
    let search_tags = new SearchTags({
        name: req.body.name,
        createdDate: d.toString()
    });
    search_tags.save(function(err) {
        if (err) {
            res.send("Could not create Search Tags.Error :" + err);
        } else {
            res.send('Search Tags Created successfully')
        }
    })

};


exports.search_tags_details = function(req, res) {

    if (req.params.id) {
        SearchTags.findById(req.params.id, function(err, types) {
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

        SearchTags.find({ disableFlag: false })
            .skip((perPage * pageNo) - perPage)
            .limit(perPage)
            .exec(function(err, types) {
                SearchTags.count({ disableFlag: false }).exec(function(err, totalcount) {
                    if (err) {
                        response = { "error": true, "message": "Error fetching data" };
                        res.send(response);
                    }
                    res.send({ tags: types, currentPage: pageNo, totalpages: Math.ceil(totalcount / perPage) })
                })
            })


    }
};

exports.search_tags_update = function(req, res) {
    SearchTags.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, search_tags) {
        if (err) { res.send(err) } else if (search_tags) { res.send('Tags successfully udpated.'); } else {
            res.send('Could not find the Tags id');
        }
    });
};

exports.search_tags_delete = function(req, res) {
    SearchTags.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.send("There was an error deleting the record");
        res.send('Record was Deleted successfully!');
    })
};

exports.search_tags_list = function(req, res) {
    SearchTags.find({ disableFlag: false }, function(err, tags) {
        if (!err) {
            res.send(tags);
        } else {
            console.log(err);
            res.send('There was error fetching the search tags');
        }
    })
}

exports.search_tags_search = function(req, res) {
    var searchText = req.query.text;
    SearchTags.find({ "name": new RegExp(searchText, 'i') }, function(err, types) {
        if (!err) {
            res.send({ tags: types });
        } else {
            console.log(err);
            res.send('There was error fetching the tags');
        }
    })
}