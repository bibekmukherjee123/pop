const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SiteSettingsSchema = new Schema({
    sitename: { type: String, required: true },
    sitelogo: { type: String },
    favicon: { type: String },
    adminlogo: { type: String },
    adminemail: { type: String },
    siteurl: { type: String },
    contactMetaTitle: { type: String },
    contactMetaDescription: { type: String },
    homeMetaTitle: { type: String },
    homeMetaDescription: { type: String },
    modifiedDate: { type: Date }

});


// Export the model
module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);