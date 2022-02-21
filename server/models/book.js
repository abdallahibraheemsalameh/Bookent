const mongoose = require('mongoose');
const con = require('../db')

const BookSchema = new mongoose.Schema({
    coverPhoto: {
        type: String
    },
    bookName: {
        type: String,
        required: true
    },
    bookGenere: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    owner: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: Array
    },
    country: {
        type: String
    },
    ownerPhone: {
        type: String
    },
    ownerId: {
        type: String
    },
    author:{
        type:String
    },
    isbn:{
        type:String
    },
    year:{
        type:Number
    }

})

const BookModel = con.books.model('book', BookSchema)
module.exports = BookModel