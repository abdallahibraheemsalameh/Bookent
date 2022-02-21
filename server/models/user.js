const mongoose = require("mongoose");
const con = require('../db')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    booksList: {
        type: Array
    },
    favList: {
        type: Array
    },
    profileImg: {
        type: String
    }
})

const UserModel = con.users.model('user', UserSchema)
module.exports = UserModel