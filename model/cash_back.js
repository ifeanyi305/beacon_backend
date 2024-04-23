const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    week_cashback: {
        type: Number,
        required: true,
    },
    week_bonus: {
        type: Number,
        required: true,
    },
    last_week_bonus: {
        type: Number,
        default: 0,
    },
    claimed_week_bonus: {
        type: Number,
        default: 0,
    },
    recharge_bonus: {
        type: Number,
        default: 0,
    },
    recharge_balance: {
        type: Number,
        required: true,
    },
    vip_level: {
        type: Number,
        required: true,
    },
    total_level_bonus: {
        type: Number,
        required: true,
    },
    monthly_cashback: {
        type: Number,
        required: true,
    },
    month_bonus: {
        type: Number,
        required: true,
    },
    claimed_month_bonus: {
        type: Number,
        default: 0,
    },
    last_month_bonus: {
        type: Number,
        default: 0,
    },
    total_bonus_claimed: {
        type: Number,
        required: true,
    },
    recharge_settings: {
        type: String,
        required: true,
    },
    recharge_claimed_at: {
        type: Date,
    },
    recharge_activated: {
        type: Boolean,
        default: false,
    },
    recharge_end: {
        type: Date,
    },
    next_level_point: {
        type: Number,
        required: true,
    },
    total_wagered: {
        type: Number,
        required: true,
    },
    nextMonday: {
        type: Date,
        required: true,
    },
    nextMonth: {
        type: Date,
        required: true,
    },
}, { timestamp : true})

module.exports = mongoose.model('cashback', Userschema)