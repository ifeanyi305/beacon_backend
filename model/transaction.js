const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    transaction_type: {
        type: String,
        required: true,
    },
    sender_img: {
        type: String,
        required: true,
    },
    sender_name: {
        type: String,
        required: true,
    },
    sender_balance: {
        type: Number,
        required: true,
    },
    trx_amount: {
        type: Number,
        required: true,
    },
    receiver_balance: {
        type: Number,
        required: true,
    },
    receiver_img: {
        type: String,
        required: true,
    },
    receiver_name: {
        type: String,
        required: true,
    },
    datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    transaction_id: {
        type: Number,
        required: true,
    },
    is_sending: {
        type: Boolean,
        required: true,
    },
}, { timestamp : true})

module.exports = mongoose.model('transaction', Userschema)