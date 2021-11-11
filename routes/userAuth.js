const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const verifyToken = require('../utils/verifyToken')

router.post('/login', async(req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username }).select('+password')
        // if(req.body.username) return res.json({error: "Username is not a valid option"})
        if (!user) return res.json({ error: "Invalid Credentials" })
        
        const isMatch = await user.matchPassword(req.body.password)
        if(!isMatch) return res.json({ error: "Invalid Credentials" })
        const accessToken = jwt.sign({username: user.username, _id:user._id}, '1234')
        const {password, email, ...other} = user._doc

        res.status(200).json({...other, accessToken})
    } catch (error) {
        res.status(400).json(error.message.slice(35))
    }

})

router.post('/register', async(req, res) => {
    const { username, email, password } = req.body
    
    if(!username) return res.json({error: 'Enter an username'})
    if(!email) return res.json({error: 'Enter an email'})
    if(!password) return res.json({error: 'Enter a password'})
 
    const user = new User({username, email, password})
    const existEmail = await User.findOne({ email })
    if(existEmail) return res.json({error: "Email already exist"})

    try {
        const newUser = await user.save()
        
        const {password, ...other} = newUser._doc

        res.status(201).json(other)
    } catch (error) {
        res.status(400).json(error.message.slice(35))
    }
})


router.post('/addFriend/:userId', verifyToken, async(req, res) => {
    const currentUserId = req.user._id
    const paramsId = req.params.userId
    try {
        const paramsUser = await User.findOne({_id: paramsId})
        const { createdAt, updatedAt, friends, ...emailAndName } = paramsUser._doc
        if (!emailAndName) return res.status(400).json({ error: "Invalid User" })
        
        const friendExist = await User.findOne({ _id: currentUserId, friends: emailAndName })
        if (friendExist) return res.status(400).json({ error: "User already in your friend" })

        if(currentUserId == paramsId) return res.json({error: "You cant add yourself"})
        
        const user = await User.findOneAndUpdate({ _id: currentUserId }, {
            $push:{
                friends: emailAndName        
            }
        })

        const adder = await User.findOne({ _id: currentUserId })
        
        const { createdAt: adderCreated, updatedAt: adderUpdate, friends: adderFriends, ...adderDetail } = adder._doc

        // add the current user to the added friend
        await User.findOneAndUpdate({ _id: paramsUser }, {
            $push:{
                friends: adderDetail        
            }
        })


        if(!user) return res.status(404).json({error: "Invalid User"})

        res.status(200).json(user)
    } catch (error) {
        res.status(404).json(error.message.slice(35))
    }

})


router.post('/deleteFriend/:userId', verifyToken, async (req, res) => {
    const currentUserId = req.user._id
    const paramsId = req.params.userId
    
    if(!paramsId) return res.status(404).json({error: "Invalid User"})

    try {
        const toBeDeleted = await User.findOne({ _id: paramsId })
        
        if(paramsId != toBeDeleted._id) return res.status(404).json({error: "User not found"})

        const user = await User.findOneAndUpdate({ _id: currentUserId }, {
            $pull:{
                friends: {_id: toBeDeleted._id}
            }
        })

        const deleterId = await User.findOne({ _id: currentUserId })

        await User.findOneAndUpdate({ _id: toBeDeleted._id }, {
            $pull:{
                friends: {_id: deleterId._id}
            }
        })
    
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json(error.message.slice(35))
    }

})


module.exports = router