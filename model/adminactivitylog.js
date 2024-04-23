const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      trim: true
    },
    action: {
      type: String,
      required: true,
      default: ""
    },
    device: {
      type: String,
      required: true,
      default: ""
    },
    location: {
      type: String,
      required: true,
      default: ""
    },
    ipAddress: {
      type: String,
      required: true,
      default: ""
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("activitylog", ActivityLogSchema);
