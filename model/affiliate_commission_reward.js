const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    crypto: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    is_consumed: {
        type: Boolean,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('affiliate_commission_reward', Userschema)