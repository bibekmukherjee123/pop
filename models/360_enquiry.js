const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let shootEnquirySchema = new Schema({
    customername: { type: String, required: true },
    email: { type: String },
    mobile: { type: Number, required: true },
    address: { type: String },
    createdDate: { type: Date, required: true }
});


// Export the model
module.exports = mongoose.model('ShootEnquiries', shootEnquirySchema);