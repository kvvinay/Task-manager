const mongoose = require('mongoose')

const url = process.env.Mongo_DB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true})