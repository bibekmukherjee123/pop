const multer = require('multer');
const path = require('path');
const crypto = require('crypto')


/** Storage Engine */
const storageEngine = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
        let customFileName = crypto.randomBytes(18).toString('hex'),
            fileExtension = file.originalname.split('.')[1] // get file extension from original file name
        cb(null, customFileName + '.' + fileExtension)
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


var validateFile = function(file, cb) {
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extension && mimeType) {
        return cb(null, true);
    } else {
        cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
}


module.exports = upload;