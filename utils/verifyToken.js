const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "You are not authenticated!" })
    const accessToken = authHeader.split(' ')[1]

    jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid Token" })
        req.user = user
        next()
    })
    
}

module.exports = verifyToken