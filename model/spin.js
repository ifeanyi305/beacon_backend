const mongoose = require('mongoose')

const Spin = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    prize_amount_won: {
        type: Number,
        required: true
    },
    prize_image: {
        type: String,
        default: ''
    },
    prize_type: {
        type: String,
        required: true
    },
    is_spin: {
        type: Boolean,
        default:false
    }
},{
    timestamps: true
})

module.exports = mongoose.model('spin', Spin)