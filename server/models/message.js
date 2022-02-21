const mongoose = require("mongoose");
const con = require('../db')

const MessageSchema = new mongoose.Schema({
    conversationId:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String
    },
    createdAt:{
        type:String
    }
})

const messageModel = con.messages.model('message', MessageSchema)
module.exports = messageModel