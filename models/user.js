var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    userpassword: {
        type: String,
        required: true,
    },
    mobile: { type: Number },
    image: { type: String },
    disableFlag: {
        type: Boolean,
        default: false
    },
    createdDate: { type: Date, required: true }
});


UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.userpassword);
};

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

var User = mongoose.model('User', UserSchema);
module.exports = User;