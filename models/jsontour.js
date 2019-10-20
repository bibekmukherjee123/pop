const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let JsonTourSchema = new Schema({
    title: { type: String, required: true, unique: true },
    filepath: { type: String },
    createdDate: { type: Date, required: true },
});


// Export the model
module.exports = mongoose.model('JsonTour', JsonTourSchema);