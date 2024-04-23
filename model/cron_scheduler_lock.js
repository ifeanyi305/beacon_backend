const mongoose = require("mongoose");
const schema = mongoose.Schema
const ScheduleLockSchema = new schema({
    identifier: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        default: new Date(),
        expires: 3600
    },
}, { timestamp : true});
module.exports = mongoose.model('ScheduleLock', ScheduleLockSchema)