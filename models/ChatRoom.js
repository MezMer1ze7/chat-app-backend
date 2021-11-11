const mongoose = require('mongoose')


const ChatRoomSchema = mongoose.Schema({
    room: {
        type: String
    },
    chats: {
        type: Array
    }
},{timestamps: true})




const ChatRoom = mongoose.model("Chatroom", ChatRoomSchema)

module.exports = ChatRoom





