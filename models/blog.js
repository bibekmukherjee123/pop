const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BlogSchema = new Schema({
    title: { type: String, required: true },
    shortDescription: { type: String },
    longDescription: { type: String },
    downloadLink: { type: String },
    image: { type: String },
    imageTag: { type: String },
    createdDate: { type: Date, required: true }

});


// Export the model
module.exports = mongoose.model('Blog', BlogSchema);