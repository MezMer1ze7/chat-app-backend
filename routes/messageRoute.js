const router = require("express").Router()
const User = require('../models/User')
const Message = require("../models/Message")
const ChatRoom = require('../models/ChatRoom')
const verifyToken = require("../utils/verifyToken")



router.post('/room', async (req, res) => {
    const { room, chats } = req.body
    
    try {
        const rooms = new ChatRoom({ room })
        const newRoom = await rooms.save()

        res.json(newRoom)
    } catch (error) {
        res.json(error)
    }

})

router.get('/getRooms', async (req, res) => {
    
    try {
        const allRooms = await ChatRoom.find()

        res.status(200).json(allRooms)
    } catch (error) {
        res.status(404).json(error)
    }
})


router.post("/message/:roomName", verifyToken, async (req, res) => {
    const { message } = req.body
    const roomName = req.params.roomName
    const userId = req.user._id

    if (!userId) return res.json({ error: "invalid" })
    const validRoom = await ChatRoom.findOne({room: roomName})
    if (!validRoom) return res.status(404).json({ error: "Invalid Room" })
    
    if (!message) return res.json({ error: "Empty message" })
    
    try {
        const user = await User.findOne({ _id: userId })
        const { email, ...others } = user._doc
        
        
        const sender = new Message({sender:others.username, message})

        const getRoom = await ChatRoom.findOneAndUpdate({ room: roomName }, {
            $push: {
                chats: sender
            }   
        })

        res.status(200).json(sender)
    } catch (error) {
        res.status(401).json(error.message.slice(35))
    }
})

module.exports = router