const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    client_name: {
        type: String
    },
    phone_no: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    cpassword: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const client = mongoose.model('client', clientSchema)
module.exports = client