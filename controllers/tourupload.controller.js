var upload = require('./vrtourpath');
var fs = require('fs');
exports.vr_upload = function(req, res) {
    upload.single('tour')(req, res, (error) => {
        if (req.file) {
            console.log('File uploaded');
            var filePath = "./" + req.file.path;
            fs.chmod(filePath, 0644, function(err) {
                if (err) { console.log(err); }
            });
            fs.chown(filePath, 492, 492, function(err) {
                if (err) { console.log(err); }
            })
            res.send('success');
        } else {
            console.log('File path could not be generated');
            res.send('Error')
        }
    })
};