const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyListSchema = new Schema({
    title: { type: String, required: true },
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyType' },
    jsonTour: { type: mongoose.Schema.Types.ObjectId, ref: 'JsonTour' },
    propertyListType: { type: String, required: true },
    location: { type: String, required: true },
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity'

    }],
    propertyTags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SearchTags'

    }],
    overview: { type: String },
    hiraNumber: { type: String },
    price: { type: Number },
    saleableArea: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    balconies: { type: String },
    conditioning: { type: String },
    furnished: { type: String },
    coverImage: { type: String },
    logo: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    disableFlag: { type: Boolean, default: false },
    createdDate: { type: Date, required: true },
    modifiedDate: { type: Date }
});


// Export the model
module.exports = mongoose.model('PropertyLists', propertyListSchema);