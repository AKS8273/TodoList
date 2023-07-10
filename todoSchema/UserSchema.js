const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const todoSchema = require('./Schema');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required:true
    },
    password: String,
    googleId: String,
    list: [todoSchema]
});


UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);

module.exports = User;


