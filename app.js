require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT || 8002
const router = require('./routes/routes')
const exphbs = require('express-handlebars')
const path = require('path')
const connectDB = require('./db/connect')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const expressRateLimitter = require('express-rate-limit')

app.engine("handlebars", exphbs.engine({extname: ".handlebars", defaultLayout: false}));
app.set('view engine', 'handlebars')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.set('trust proxy', 1)
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false,
  })); //So that the css does not break
app.use(xss())
app.use(expressRateLimitter({windowsMs : 60 * 1000, max : 60}))

app.use('/', router)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()