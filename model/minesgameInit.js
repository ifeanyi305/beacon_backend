const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    profile_img: {
        type: String,
        required: true,
    },
    game_id: {
        type: Number,
        required: true,
    },
    mine: {
        type: Number,
        required: true,
    },
    bet_amount: {
        type: Number,
        required: true,
    },
    bet_id: {
        type: Number,
        required: true,
    },
    bet_token_name: {
        type: String,
        required: true,
    },
    bet_token_img: {
        type: String,
        required: true,
    },
    payout: {
        type: Number,
        required: true,
    },
    hidden_from_public: {
        type: Boolean,
        required: true,
    },
    game_hash: {
        type: String,
        required: true,
    },
    gameLoop: {
        type: Array,
        required: true,
    },
    server_seed: {
        type: String,
        required: true,
    },
    client_seed: {
        type: String,
        required: true,
    },
    active:{
        type: Boolean,
        required: true,
    },
    has_won:{
        type: Boolean,
        required: true,
    },
    nonce:{
        type: Number,
        required: true,
    },
    game_type: {
        type: String,
        required: true,
    },
    chance: {
        type: String,
        required: true,
    },
    auto_cashout: {
        type: Number,
        required: true,
    },
    user_status: {
        type: Boolean,
        required: true,
    },
    game_status: {
        type: Boolean,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    cashout:{
        type: Number,
        required: true,
    },
    profit:{
        type: Number,
        required: true,
    },
    time:{
        type: Date,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('mines_game_init', Userschema)












