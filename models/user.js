const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// This automatically adds username, password, and salt fields to the schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);