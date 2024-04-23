const mongoose = require('mongoose');

const ChatSettingsSchema = new mongoose.Schema({
    rain_bot: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        frequency_per_day: {
            type: Number,
            required: true,
            default: 4
        },
        amount_ppd_per_rain: {
            type: Number,
            required: true,
            default: 0
        },
        message: {
            type: String,
            required: true,
            default: "No message available"
        }
    },
    player_rain: {
        currency_allowed: {
            type: String,
            required: true,
            default: "PPD"
        },
        mininum_rain_amount: {
            type: Number,
            required: true,
            default: 1
        },
        number_of_people: {
            minimum: {
                type: Number,
                required: true,
                default: 1
            },
            maximum: {
                type: Number,
                required: true,
                default: 100
            }
        },
        message_length: {
            type: Number,
            required: true,
            default: 20
        },
    },
    player_coin_drop: {
        currency_allowed: {
            type: String,
            required: true,
            default: "PPD"
        },
        mininum_rain_amount: {
            type: Number,
            required: true,
            default: 1
        },
        number_of_people: {
            minimum: {
                type: Number,
                required: true,
                default: 1
            },
            maximum: {
                type: Number,
                required: true,
                default: 100
            }
        },
        message_length: {
            type: Number,
            required: true,
            default: 20
        },
    },
    chat_rules_info: {
        type: String,
        required: true,
        default: ''
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("chatsettings", ChatSettingsSchema)