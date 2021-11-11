const mongoose = require('mongoose')


const MessageSchema = mongoose.Schema({
    sender: {
        type: String
    },
    message: {
        type: String,
        maxLength: [40, "Message is too long"]
    }
},{timestamps: true})


const Message = mongoose.model("Message", MessageSchema)

module.exports = Message













