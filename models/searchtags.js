const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SearchTagsSchema = new Schema({
    name: { type: String, required: true },
    disableFlag: { type: Boolean, default: false },
    createdDate: { type: Date, required: true },
    modifiedDate: { type: Date }

});


// Export the model
module.exports = mongoose.model('SearchTags', SearchTagsSchema);