const client = require('../models/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const register = async(req, res) => {
    try {
        let { client_name, phone_no, email, password, cpassword } = req.body;

        if (!client_name) {
            return res.status(400).json({ error: "Username is missing" });
        }
        if (!phone_no) {
            return res.status(400).json({ error: "Phone Number is missing" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email ID is missing" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is missing" });
        }
        if (!cpassword) {
            return res.status(400).json({ error: "Confirm Password is missing" });
        }

        const clientExist = await client.findOne({ $or: [{ email: email }, { phone_no: phone_no }] });
        if (clientExist) {
            return res.status(400).json({ message: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const hashedCPassword = await bcrypt.hash(req.body.cpassword, 10)
            const Client = new client({
                client_name: req.body.client_name,
                phone_no: req.body.phone_no,
                email: req.body.email,
                password: hashedPassword,
                cpassword: hashedCPassword
            });
            const clientRegister = await Client;
            if (clientRegister) {
                if (password === cpassword) {
                    let token = jwt.sign({ name: clientRegister.name }, 'verySecretValue', { expiresIn: '1hr' })
                    clientRegister.save()
                    return res.status(201).json({ message: "User registered successfully :) ", token });
                } else {
                    return res.status(422).json({ error: "Passwords didnot match" });
                }
            }
        }

    } catch (err) {
        console.log("Please fill your details");

    }

}

const login = async(req, res) => {
    var username = req.body.username
    var password = req.body.password

    await client.findOne({ $or: [{ email: username }, { phone_no: username }] })
        .then(Client => {
            if (Client) {
                bcrypt.compare(password, Client.password, function(err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ name: Client.name }, 'verySecretValue', { expiresIn: '1hr' })
                        res.json({
                            message: 'Login Successful! :)',
                            token
                        })
                    } else {
                        res.json({
                            message: 'Password incorrect :('
                        })
                    }
                })
            } else {
                res.json({
                    message: 'User not found!!'
                })
            }
        })
}

module.exports = {
    register,
    login
}