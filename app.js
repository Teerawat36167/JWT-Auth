require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

//Register
app.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body
        
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required")
        }
        
        const oldUser = await User.findOne({ email })

        if (oldUser) {
            return res.status(409).send("User already exist. Please login")
        }

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name ,
            email: email.toLowerCase(),
            password: encryptedPassword 
        })

        const token = jwt.sign(
            { user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )

        // save token
        user.token = token

        res.status(201).json(user)

    } catch (err) {
        console.log(err)
    }
})

//Login
app.post("/login", (req, res) => {

})

module.exports = app