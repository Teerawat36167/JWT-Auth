require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')

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
                expiresIn: "1d"
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
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!(email && password)) {
            res.status(400).send("All input is required")
        }

        const user = await User.findOne({ email })

        if (user && (bcrypt.compare(password, user.password))) {
            //Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )

            // save token
            user.token = token
    
            res.status(200).json(user)
        }

        res.status(400).send("Invalid Credentials")

    } catch (err) {
        console.log(err)
    }
})

app.post('/welcome', auth, (req, res) => {
    res.status(200).send('Welcome 🙏🏻')
})

module.exports = app