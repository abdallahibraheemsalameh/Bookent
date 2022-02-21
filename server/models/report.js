const mongoose = require("mongoose");
const con = require('../db')

const ReportSchema = new mongoose.Schema({
    sender: {
        type: String,
    },
    text: {
        type: String,
    },
    target: {
        type: String,
    },
    book: {
        type: String,
    },
})

const ReportModel = con.reports.model('report', ReportSchema)
module.exports = ReportModel