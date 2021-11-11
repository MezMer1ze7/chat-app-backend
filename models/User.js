const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: [3, 'Username is too short'],
        maxLength: [10, 'Username is too long'],
        unique: [true, 'Username must be unique'],
        lowercase: true
    },
    email: {
        type: String,
        unique: [true, 'Email must be unique'],
        lowercase: true
    },
    password: {
        type: String,
        minLength: [3, 'Password is too short'],
        select: false
    },
    friends: {
      type: Array  
    }
}, {timestamps: true})


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


const User = mongoose.model("Users", UserSchema)
module.exports = User
