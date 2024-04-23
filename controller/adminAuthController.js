const os = require('os');
const axios = require('axios');
const Admin = require("../model/admin");
const AdminActivityLog = require("../model/adminactivitylog");
const AdminChatSettings = require('../model/adminchatsettings');
const userIdGeneratorService = require('../utils/userId');

const createActivityLog = async (admin_id, action, req) => {
    try {
        const device = os.hostname();
        const ipAddress = req.ip;
        let location = 'Local-Host'
        if (!(ipAddress === '::1')) {
            const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`)
            location = response.data
        }



        await AdminActivityLog.create({
            admin_id,
            action,
            device,
            location,
            ipAddress
        })
    } catch (err) {
        console.log(err)
    }
}

// SENDS A RESPONSE WITH TOKEN IN BODY AND COOKIE
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getAuthToken();

    res.status(statusCode).json({
        success: true,
        accessToken: token,
        user: {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            access: user.access,
        }
    });
};

// REGISTER
const register = async (req, res, next) => {
    const { access } = req.user
    const { username, password, pin, accesses } = req.body;
    try {
        if (!(access.create_admin === 'Full Access')) {
            return res.status(400).json({
                success: false,
                message: "You're not authorized to perform this operation"
            });
        }

        if (!username || !password || !pin || !accesses) {
            return res.status(400).json({
                success: false,
                message: "Kindly provide all field data"
            });
        }


        let check_username = await Admin.find({ username: username });
        if (check_username.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User with the same username already exists"
            });
        }

        // else create a new user

        const user = await Admin.create({
            user_id: await userIdGeneratorService(),
            username,
            password,
            pin,
            access: accesses
        });

        if (req.user) {
            await createActivityLog(req.user.id, "New Admin Created", req)
        }

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            user
        })

    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

// LOGIN
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Kindly provide a Username and password"
            });
        }
        const user = await Admin.findOne({ username }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        if (!(await user.verifyPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        //Log Activity
        await createActivityLog(user._id, "Logged In", req)

        await Admin.findOneAndUpdate({ _id: user._id }, { lastLogin: Date.now() });

        return res.status(200).json({
            success: true,
            userId: user.user_id
        })

    } catch (err) {
        return res.status(500).json({ error: err });
    }
};
// LOGIN
const confirmPin = async (req, res, next) => {
    try {
        const { pin, userId } = req.body;
        if (!pin || !userId) {
            return res.status(400).json({
                success: false,
                message: "Kindly provide a Pin and User ID"
            });
        }
        const user = await Admin.findOne({ user_id: userId });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No User Found"
            });
        }

        if (!(await user.pin === pin)) {
            return res.status(401).json({
                success: false,
                message: "Invalid Pin"
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};
// CURRENT USER
const currentUser = async (req, res) => {
    try {
        const user = await Admin.findById(req.user.id);
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};
//FIND BY ID
const findAdminById = async (req, res, next) => {
    try {
        const { access } = req.user
        if (!(access.member_profile === 'Full Access' || access.member_profile === 'View Only')) {
            return res.status(400).json({
                success: false,
                message: "You're not authorized to perform this operation"
            });
        }
        const { id } = req.params
        const user = await Admin.findById(id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found with this ID"
            });
        }
        const userActivityLog = await AdminActivityLog.find({ admin_id: id }).sort({ createdAt: -1 })
        return res.status(401).json({
            success: true,
            data: user,
            activity: userActivityLog || null
        });
    } catch (err) {
        return res.status(500).json({ error: err });
        // console.log(err)
    }
}
//FIND BY USERNAME
const findAdminByUsername = async (req, res, next) => {
    try {
        const { access } = req.user
        if (!(access.member_profile === 'Full Access' || access.member_profile === 'View Only')) {
            return res.status(400).json({
                success: false,
                message: "You're not authorized to perform this operation"
            });
        }
        const user = await Admin.findOne({ username: req.params.username })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found with this ID"
            });
        }
        const userActivityLog = await AdminActivityLog.find({ admin_id: req.user.id }).sort({ createdAt: -1 })
        return res.status(401).json({
            success: true,
            data: user,
            activity: userActivityLog || null
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//UPDATE ADMIN
const updateAdmin = async (req, res, next) => {
    const { access } = req.user
    const { user_id, accesses } = req.body;
    try {
        if (!(access.create_admin === 'Full Access')) {
            return res.status(400).json({
                success: false,
                message: "You're not authorized to perform this operation"
            });
        }

        if (!user_id || !accesses) {
            return res.status(400).json({
                success: false,
                message: "Kindly provide all field data"
            });
        }
        const user = await Admin.findById(user_id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found with this ID"
            });
        }
        const result = await Admin.updateOne({ _id: user_id }, {
            $set: {
                "access": {
                    "member_list": accesses.member_list,
                    "create_member": accesses.create_member,
                    "member_profile": accesses.member_profile,
                    "daily_report": accesses.daily_report,
                    "game_report": accesses.game_report,
                    "ggr_report": accesses.ggr_report,
                    "deposit_bonus_report": accesses.deposit_bonus_report,
                    "create_admin": accesses.create_admin
                }

            }
        }, { upsert: true })

        //Log Activity
        await createActivityLog(user._id, "Update Admin Access", req)

        return res.status(401).json({
            success: true,
            message: "Admin Access has been updated",
            data: result
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//UPDATE PIN
const updatePin = async (req, res, next) => {
    try {
        const id = req.user.id
        const { pin } = req.body
        const user = await Admin.findById(id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found"
            });
        }
        user.pin = pin
        await user.save()
        //Log Activity
        await createActivityLog(user._id, "Update PIN", req)

        return res.status(401).json({
            success: true,
            message: "Your PIN has been updated",
            data: user
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//UPDATE PASSWORD
const updatePassword = async (req, res, next) => {
    try {
        const { id } = req.user
        const { password } = req.body
        const user = await Admin.findById(id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found"
            });
        }
        user.password = password
        await user.save()
        //Log Activity
        await createActivityLog(user._id, "Update Password", req)

        return res.status(401).json({
            success: true,
            message: "Your Password has been updated",
            data: user
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//UPDATE SUSPEND
const suspend = async (req, res, next) => {
    try {
        const { user_id } = req.body
        const { access } = req.user
        if (!(access.create_admin === 'Full Access')) {
            return res.status(400).json({
                success: false,
                message: "You're not authorized to perform this operation"
            });
        }

        const user = await Admin.findById(user_id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found"
            });
        }
        user.suspend_status = !user.suspend_status
        await user.save()
        //Log Activity
        await createActivityLog(req.user.id, "Suspend / Unsuspend a User", req)

        return res.status(401).json({
            success: true,
            message: "Operation Successfull",
            data: user
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

//UPDATE AVAILABILITY
const updateAvailability = async (req, res, next) => {
    try {
        const id = req.user.id
        const user = await Admin.findById(id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user found"
            });
        }
        if (user.availability_status === 'inactive') {
            user.availability_status = 'active';
        } else if (user.availability_status === 'active') {
            user.availability_status = 'inactive';
        }

        await user.save()
        //Log Activity
        await createActivityLog(user._id, "Update Availability", req)

        return res.status(401).json({
            success: true,
            message: "Availability was updated successfully",
            data: user
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//REMOVE ADMIN
const removeAdmin = async (req, res, next) => {
    try {
        const { id } = req.params
        const { access } = req.user
        if (!(access.create_admin === 'Full Access')) {
            return res.status(400).json({
                success: false,
                message: "You're not authorized to perform this operation"
            });
        }
        const user = await Admin.deleteOne({ _id: id })
        if (user.deletedCount <= 0) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }

        //Log Activity
        await createActivityLog(req.user.id, "User Removed", req)

        return res.status(401).json({
            success: true,
            message: "User Removed successfully",
            data: user
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//Fetch all admin
const getAllAdmin = async (req, res, next) => {
    try {
        const users = await Admin.find()
        if (!users) {
            return res.status(401).json({
                success: false,
                message: "Users not found"
            });
        }


        return res.status(401).json({
            success: true,
            message: "Admins retrieved successfully",
            data: users
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}
//Create chat Settings
const createChatSettings = async (req, res, next) => {
    try {
        const chat = await AdminChatSettings.create({
            chat_rules_info: "New Message"
        })
        return res.status(201).json({
            success: true,
            message: "Chat Settings Created Success"
        })
    } catch (err) {
        return res.status(500).json({ error: err });
    }

}
//Update chat Settings
const updateChatSettings = async (req, res, next) => {
    try {
        const data = req.body
        const result = await AdminChatSettings.updateOne({ _id: data._id }, {
            $set: {
                "rain_bot": {
                    "status": data.rain_bot.status,
                    "frequency_per_day": data.rain_bot.frequency_per_day,
                    "amount_ppd_per_rain": data.rain_bot.amount_ppd_per_rain,
                    "message": data.rain_bot.message,
                },
                "player_rain": {
                    "number_of_people": {
                        "minimum": data.player_rain.minimum,
                        "maximum": data.player_rain.maximum
                    },
                    "currency_allowed": data.player_rain.currency_allowed,
                    "mininum_rain_amount": data.player_rain.mininum_rain_amount,
                    "message_length": data.player_rain.message_length
                },
                "player_coin_drop": {
                    "number_of_people": {
                        "minimum": data.player_coin_drop.number_of_people.minimum,
                        "maximum": data.player_coin_drop.number_of_people.maximum
                    },
                    "currency_allowed": data.player_coin_drop.currency_allowed,
                    "mininum_rain_amount": data.player_coin_drop.mininum_rain_amount,
                    "message_length": data.player_coin_drop.message_length
                },
                "chat_rules_info": data.chat_rules_info
            }
        }, { upsert: true })
        //Log Activity
        await createActivityLog(req.user.id, "Update Chat Settings", req)
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        return res.status(500).json({ error: err });
        // console.log(err)
    }
}
//Get chat Settings
const getChatSettings = async (req, res, next) => {
    try {
        const chatsettings = await AdminChatSettings.find()
        if (!chatsettings) {
            return res.status(201).json({
                success: false,
                message: "No Chat Settings"
            })
        }
        return res.status(200).json({
            success: true,
            chatsettings: chatsettings
        })
    } catch (err) {
        return res.status(500).json({ error: err });
    }

}
module.exports = {
    register,
    login,
    currentUser,
    confirmPin,
    findAdminById,
    findAdminByUsername,
    updateAdmin,
    updatePin,
    updatePassword,
    suspend,
    updateAvailability,
    removeAdmin,
    getAllAdmin,
    createChatSettings,
    updateChatSettings,
    getChatSettings
}