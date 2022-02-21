require('dotenv/config')
const { sign, verify } = require('jsonwebtoken')

const createToken = (user) => {
    const accessToken = sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY
    )
    return accessToken
}


const validateToken = (req, res, next) => {
    //const accessToken = req.cookies["access-token"]
    const token =  req.headers["x-access-token"]
    
    if (!token) return res.send('not Authenticated')
    // add if not res.redirect
    else {
            verify(token, process.env.JWT_KEY,(err,decoded)=>{
                if(err)
                res.send('sorry not authenticated')
                else{
                    req.userid=decoded.id
                    next()
                }
            })
    }
}


module.exports = { createToken, validateToken }