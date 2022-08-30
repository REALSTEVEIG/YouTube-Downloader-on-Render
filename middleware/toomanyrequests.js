const {StatusCodes} = require('http-status-codes')

const tooManyRequests = (req, res) => {
    if (StatusCodes === 429) {
        return res.render('index', {error : `Too many requests to our server at this time. Please try again later`})
    }
}

module.exports = tooManyRequests
