const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
    {
        user_id: {
            type : String,
            required: true,

        },
        username: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Please provide a password"],
            select: false
        },
        pin: {
            type: String,
            match: [/^[\w-_.]{6}$/, "Please provide a valid 6 digit pin"],
            required: true
        },
        access: {
            member_list: {
                type: String,
                required: true
            },
            create_member: {
                type: String,
                required: true
            },
            member_profile: {
                type: String,
                required: true
            },
            daily_report: {
                type: String,
                required: true
            },
            game_report: {
                type: String,
                required: true
            },
            ggr_report: {
                type: String,
                required: true
            },
            deposit_bonus_report: {
                type: String,
                required: true
            },
            create_admin: {
                type: String,
                required: true
            }
        },
        suspend_status: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/creative-builder/image/upload/v1627792946/WeShare/avatar_cugq40_ocwbvk.png"
        },
        availability_status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        activity_log: {
            type: mongoose.Types.ObjectId,
            ref: "activitylogs"
        }
    }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Checks provided password against encrypted version in DB
AdminSchema.methods.verifyPassword = async function (enteredPassword) {
    const verified = await bcrypt.compare(enteredPassword, this.password);
    return verified;
};
/* Middleware to encrypt password when as before every save event where pin 
field is modified */
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Assigns an auth token to client which has a specified expiry date
AdminSchema.methods.getAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

AdminSchema.methods.createRefreshToken = payload => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};


module.exports = mongoose.model("Admin", AdminSchema);
