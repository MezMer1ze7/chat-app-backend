const mongoose = require('mongoose')

const connectDB = async() => {
    await mongoose.connect(`mongodb+srv://Mez:2X8QbCLat2qpc5vz@cluster0.6zaar.mongodb.net/chatapp?retryWrites=true&w=majority
    `)
        .then(console.log('DB Connected'))
        .catch(err => console.log(err))
}


module.exports = connectDB