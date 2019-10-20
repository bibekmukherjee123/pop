const multer = require('multer');
const path = require('path');
const crypto = require('crypto')


/** Storage Engine */
const storageEngine = multer.diskStorage({
    destination: './public/3d_tour/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

//init

const upload = multer({
    storage: storageEngine,
    // limits: { fileSize: 400000 },
    // fileFilter: function(req, file, callback) {
    //     validateFile(file, callback);
    // }
});

module.exports = upload;