const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AmenitySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    imageTag: { type: String },
    disableFlag: { type: Boolean, default: false },
    createdDate: { type: Date, required: true },
    modifiedDate: { type: Date }

});


// Export the model
module.exports = mongoose.model('Amenity', AmenitySchema);