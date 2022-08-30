const mongoose = require('mongoose')

const connectDB = (url) => {
    return new mongoose.connect(url, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
}

module.exports = connectDB