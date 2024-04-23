const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('FDCounter', CounterSchema);

const FlashDropSchema = new schema({
    flashdrop_id: {
        type: Number,
        default: 1,
    },
    shit_code: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: "PPL",
    },
    wager_requirement: {
        type: Number,
        default: 0
    },
    level_requirement: {
        type: Number,
        default: 0
    },
    threshold_limit: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    },
}, { timestamp: true })
FlashDropSchema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'flashdrop_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.flashdrop_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('FlashDrop', FlashDropSchema)