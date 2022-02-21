const mongoose = require("mongoose");
const con = require('../db')

const ConversationSchema = new mongoose.Schema({
    members:{
        type:Array
    }
})

const conversationModel = con.conversations.model('conversation', ConversationSchema)
module.exports = conversationModel