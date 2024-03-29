const mongoose = require('mongoose')

mongoose.set('strictQuery',true)

const { MONGO_URI } = process.env

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to database")
    })
    .catch((error) => {
        console.log("Error connecting to database")
        console.error(error)
        process.exit(1)
    })
}