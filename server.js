require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./DB/MongoDB')
const userAuth = require('./routes/userAuth')
const messageRoute = require("./routes/messageRoute")
const socketIo = require("socket.io")
const http = require('http')

const app = express()
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {

    socket.on("joinRoom", (activeRoomName) => {

        socket.join(activeRoomName)
    })

    socket.on("message", (data, activeRoomName) => {
        io.to(activeRoomName).emit("returnMessage", data)
    })


})


app.use(express.json())
app.use(cors())

app.use('/api', userAuth)
app.use('/api', messageRoute)


connectDB()

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server Started on PORT: ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err}`)
    server.close(()=>process.exit(1))
})