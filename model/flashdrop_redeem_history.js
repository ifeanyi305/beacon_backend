const mongoose = require("mongoose");
const schema = mongoose.Schema
const CounterSchema = new schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('FDRCounter', CounterSchema);

const FlashDropRedeemSchema = new schema({
    redeem_id: {
        type: Number,
        default: 1,
    },
    flashdrop_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamp: true })
FlashDropRedeemSchema.pre('save', async function (next) {
    try {
        const counter = await Counter.findByIdAndUpdate({ _id: 'redeem_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        this.redeem_id = counter.seq;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('FlashDropRedeem', FlashDropRedeemSchema)