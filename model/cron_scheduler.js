const mongoose = require("mongoose");
const schema = mongoose.Schema
const SchedulerSchema = new schema({
    identifier: {
        type: String,
        required: true
    },
    expression: {
        type: String,
        required: true,
    },
    module: {
        type: String,
        required: true
    },
    task: {
        type: String
    },
    args: {
        type: String
    },
}, { timestamp : true});
module.exports = mongoose.model('Scheduler', SchedulerSchema)