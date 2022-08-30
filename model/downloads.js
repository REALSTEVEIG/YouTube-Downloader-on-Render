const mongoose = require('mongoose')

const downloadSchema = new mongoose.Schema({
    contentTitle : {
        type: String,
    }
},{timestamps : true})

module.exports = mongoose.model('Downloads', downloadSchema)