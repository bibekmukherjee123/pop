const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SocialSettingsSchema = new Schema({
    linkedin: { type: String },
    facebook: { type: String },
    pinterest: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    modifiedDate: { type: Date }
});


// Export the model
module.exports = mongoose.model('SocialSettings', SocialSettingsSchema);