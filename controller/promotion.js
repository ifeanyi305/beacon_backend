
const Profile = require('../model/Profile');
const RollCompetition = require('../model/roll_competiton');
const Spin = require('../model/spin');


const is_spin = async (req, res, next) => {
    try {
        const date = new Date()
        //Get if loggged in user have spin 
        const userSpin = await Spin.findOne({ user_id: req.user.id })
        if (userSpin) {
            if (userSpin.is_spin === true) {
                const currentTime = Date.now()
                const endOfTheDay = date.setHours(24, 59, 59, 999)

                const remainingTime = endOfTheDay - currentTime

                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                const nxt_spin = `${hours}:${minutes}:${seconds}`;
                return res.status(200).json({
                    success: true,
                    is_spin: userSpin.is_spin,
                    nxt_spin: nxt_spin
                })
            }
        }

        return res.status(200).json({
            success: true,
            is_spin: false
        })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

const spin = async (req, res, next) => {
    try {
        let nxt_spin = ''
        const date = new Date()

        // Generate a random result 
        const prizes = [
            {
                amount: 0.0002,
                image: '',
                type: 'ETH'

            },
            {
                amount: 0.5000,
                image: '',
                type: 'G'

            },
            {
                amount: 0.1000,
                image: '',
                type: 'G'

            },
            {
                amount: 0.0010,
                image: '',
                type: 'ETH'

            },
            {
                amount: 1000.0,
                image: '',
                type: 'B'

            },
            {
                amount: 2500.0,
                image: '',
                type: 'B'

            },
            {
                amount: 5000.0,
                image: '',
                type: 'B'

            },
            {
                amount: 10.0000,
                image: '',
                type: 'ETH'

            },
            {
                amount: 1.0000,
                image: '',
                type: 'G'

            }, ,
            {
                amount: 0.0001,
                image: '',
                type: 'ETH'

            },
            {
                amount: 0.0005,
                image: '',
                type: 'ETH'

            },
            {
                amount: 0.2500,
                image: '',
                type: 'G'

            },
            {
                amount: 50.000,
                image: '',
                type: 'B'

            },
            {
                amount: 100.00,
                image: '',
                type: 'B'

            },
            {
                amount: 7500.0,
                image: '',
                type: 'B'

            },
            {
                amount: 10000.,
                image: '',
                type: 'B'

            }
        ]
        //Get if loggged in user have spin 
        const userSpin = await Spin.findOne({ user_id: req.user.id })

        if (userSpin) {
            if (userSpin.is_spin === true) {

                //Determine the time to next spin 
                const currentTime = Date.now()
                const endOfTheDay = date.setHours(24, 59, 59, 999)

                const remainingTime = endOfTheDay - currentTime

                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                nxt_spin = `${hours}:${minutes}:${seconds}`;
                return res.status(200).json({
                    success: true,
                    is_spin: userSpin.is_spin,
                    nxt_spin: nxt_spin
                })
            }
        }

        const randomIndex = Math.floor(Math.random() * prizes.length);
        const result = prizes[randomIndex];

        const userProfile = await Profile.findOne({ user_id: req.user.id })
        const savedSpin = await Spin.create({
            user_id: req.user.id,
            username:" userProfile.username",
            prize_amount_won: result.amount,
            prize_image: result.image,
            prize_type: result.type,
            is_spin: true
        })

        //Determine the time to next spin 
        const currentTime = Date.now()
        const endOfTheDay = date.setHours(24, 59, 59, 999)

        const remainingTime = endOfTheDay - currentTime

        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        nxt_spin = `${hours}:${minutes}:${seconds}`;
        return res.status(201).json({ success: true, savedSpin, nxt_spin });
    } catch (err) {
        return res.status(500).json({ err })
    }
}

const getUserSpinTransaction = async (req, res, next) => {
    try {
        const userTrx = await Spin.findOne({ user_id: req.user.id });
        return res.status(200).json({ success: true, userTrx });
    } catch (err) {
        return res.status(500).json({ err })
    }
}

const getAllSpin = async (req, res, next) => {
    try {
        const users = await Spin.find();
        const sortedUser = users.map(user => {
            return {
                username: user.username,
                prize_type: user.prize_type,
                prize_amount_won: user.prize_amount_won
            }
        })
        return res.status(200).json({ success: true, sortedUser });
    } catch (err) {
        return res.status(500).json({ err })
    }
}


const rollcompetition = async (req, res, next) => {
    // const id = req.id;
    const id = '3d2f3f2d3f2ffg3gwq3'
    try {
        const user = await Profile.findOne({ user_id: id })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user with this ID"
            })
        }

        if (user.vip_level < 3) {
            return res.status(404).json({
                success: false,
                message: "Only user with vip level above 3 are allowed to participate in the Roll Competition"
            })
        }
        //Check if user already rolled before
        const user_rolled = await RollCompetition.findOne({ user_id: user.user_id })
        if (user_rolled) {
            return res.status(404).json({
                success: false,
                message: "You can only roll once per day"
            })
        }
        const result = []

        for (let i = 0; i < 3; i++) {
            const roll = Math.floor(Math.random() * 9);
            result.push(roll)
        }
        const rolled = await RollCompetition.create({
            user_id: id,
            rolled_figure: result.join("")
        })
        // parseInt(result.join(""), 10)
        return res.status(200).json({
            success: true,
            rolled
        })
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

module.exports = {
    is_spin,
    spin,
    rollcompetition,
    getUserSpinTransaction,
    getAllSpin
}