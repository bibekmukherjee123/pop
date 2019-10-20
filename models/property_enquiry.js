const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyEnquirySchema = new Schema({
    customername: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number },
    propertyname: { type: String, required: true },
    comment: { type: String },
    createdDate: { type: Date, required: true }
});


// Export the model
module.exports = mongoose.model('PropertyEnquiries', propertyEnquirySchema);