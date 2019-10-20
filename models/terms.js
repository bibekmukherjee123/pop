const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let termsSchema = new Schema({
    description: { type: String, required: true },
    modifiedDate: { type: Date }
});


// Export the model
module.exports = mongoose.model('TermsConditions', termsSchema);