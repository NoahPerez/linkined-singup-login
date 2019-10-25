const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

var User = new mongoose.Schema({
    //here we can insert extra properties
    //_id
    //username
    //hash
    //salt
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },

})

User.plugin(passportLocalMongoose)
//register => to create a new user, hashing the password and checking if the username is unique
//authenticate => took username and password and verifies it

module.exports = mongoose.model("User", User)