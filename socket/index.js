const { Server } = require("socket.io")
const crypto = require('crypto');
const axios = require("axios");
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
const DiceGame = require("../model/dice_game");
const DiceEncrypt = require("../model/dice_encryped_seeds");
const PPFWallet = require("../model/PPF-wallet");
const USDTWallet = require("../model/Usdt-wallet");
const Chats = require("../model/public-chat");
const { handleWagerIncrease } = require("../profile_mangement/index");
const Bills = require("../model/bill");
const { handleHiloBet, handleHiloNextRound, handleHiloCashout, initHiloGame } = require("../controller/hiloController");

const minesgameInit = require('../model/minesgameInit');
const Profile = require("../model/Profile");
let maxRange = 100

async function createsocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "https://dotplayplay.netlify.app"
            // origin: "http://localhost:5173"
        }
    });

    // let fghhs = await DiceGame.find()
    let activeplayers = []
    const fetchActivePlayers = (async (e) => {
        if (activeplayers.length > 21) {
            activeplayers.shift()
            activeplayers.push(e)
        } else {
            activeplayers.push(e)
        }
        io.emit("dice-gamePLayers", activeplayers)
    })

    // setInterval(()=>{
    //     fetchActivePlayers()
    // }, 1000)


    const handleDiceBEt = (async (data) => {
        let events = data[0]
        fetchActivePlayers(events)
        try {
            if (events.token !== "PPF") {
                handleWagerIncrease(events)
            }
            let result = await DiceGame.create(events)
            if (result) {
                io.emit("dice-troo", [result])
            }
        } catch (error) {
            console.log(error)
        }
        let bil = {
            user_id: events.user_id,
            transaction_type: "Classic Dice",
            token_img: events.token_img,
            token_name: events.token,
            balance: events.current_amount,
            trx_amount: events.has_won ? events.wining_amount : events.bet_amount,
            datetime: events.time,
            status: events.has_won,
            bill_id: events.bet_id
        }

        await Bills.create(bil)
    })


    const handleUpdatewallet = (async (data) => {
        try {
            await DiceEncrypt.updateOne({ user_id: data.user_id }, {
                nonce: parseFloat(data.nonce) + 1
            })
            if (data.token === "PPF") {
                let sjj = await PPFWallet.find({ user_id: data.user_id })
                let prev_bal = parseFloat(sjj[0].balance)
                let wining_amount = parseFloat(data.wining_amount)
                let bet_amount = parseFloat(data.bet_amount)
                if (data.has_won) {
                    let current_amount = prev_bal + wining_amount
                    io.emit("dice-wallet", [{ ...data, current_amount }])
                    await PPFWallet.updateOne({ user_id: data.user_id }, { balance: current_amount });
                }
                else {
                    let current_amount = prev_bal - bet_amount
                    io.emit("dice-wallet", [{ ...data, current_amount }])
                    await PPFWallet.updateOne({ user_id: data.user_id }, { balance: prev_bal - bet_amount });
                }
            }
            else if (data.token === "USDT") {
                let sjj = await USDTWallet.find({ user_id: data.user_id })
                let prev_bal = parseFloat(sjj[0].balance)
                let wining_amount = parseFloat(data.wining_amount)
                let bet_amount = parseFloat(data.bet_amount)
                if (data.has_won) {
                    let current_amount = prev_bal + wining_amount
                    io.emit("dice-wallet", [{ ...data, current_amount }])
                    await USDTWallet.updateOne({ user_id: data.user_id }, { balance: prev_bal + wining_amount });
                }
                else {
                    let current_amount = prev_bal - bet_amount
                    io.emit("dice-wallet", [{ ...data, current_amount }])
                    await USDTWallet.updateOne({ user_id: data.user_id }, { balance: current_amount });
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    })

    const handleMybet = ((e, user) => {
        if (user.is_roll_under) {
            if (parseFloat(e.cashout) < parseFloat(user.chance)) {
                let prev_bal = parseFloat(user.prev_bal)
                let wining_amount = parseFloat(user.wining_amount)
                let current_amount = (parseFloat(prev_bal + wining_amount)).toFixed(4)
                handleUpdatewallet({ has_won: true, current_amount, ...user })
                const data = [{ ...e, ...user, current_amount, has_won: true, profit: wining_amount, bet_id: Math.floor(Math.random() * 100000000000) + 720000000000 }]
                handleDiceBEt(data)
            } else {
                let prev_bal = parseFloat(user.prev_bal)
                let bet_amount = parseFloat(user.bet_amount)
                let current_amount = (parseFloat(prev_bal - bet_amount)).toFixed(4)
                handleUpdatewallet({ current_amount, has_won: false, ...user })
                const data = [{ ...e, ...user, current_amount, has_won: false, profit: 0, bet_id: Math.floor(Math.random() * 100000000000) + 720000000000 }]
                handleDiceBEt(data)
            }
        } else {
            if (parseFloat(e.cashout) > parseFloat(user.chance)) {
                let prev_bal = parseFloat(user.prev_bal)
                let wining_amount = parseFloat(user.wining_amount)
                let current_amount = (parseFloat(prev_bal + wining_amount)).toFixed(4)
                handleUpdatewallet({ has_won: true, current_amount, ...user })
                const data = [{ ...e, ...user, current_amount, has_won: true, profit: wining_amount, bet_id: Math.floor(Math.random() * 100000000000) + 720000000000 }]
                handleDiceBEt(data)
            } else {
                let prev_bal = parseFloat(user.prev_bal)
                let bet_amount = parseFloat(user.bet_amount)
                let current_amount = (parseFloat(prev_bal - bet_amount)).toFixed(4)
                handleUpdatewallet({ current_amount, has_won: false, ...user })
                const data = [{ ...e, ...user, current_amount, has_won: false, profit: 0, bet_id: Math.floor(Math.random() * 100000000000) + 720000000000 }]
                handleDiceBEt(data)
            }
        }
    })


    const handleDicePoints = ((e) => {
        function generateRandomNumber(serverSeed, clientSeed, hash, nonce) {
            const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}-${salt}`;
            const hmac = crypto.createHmac('sha256', combinedSeed);
            const hmacHex = hmac.digest('hex');
            const decimalValue = (parseInt(hmacHex, 32) % 10001 / 100)
            const randomValue = (decimalValue % maxRange).toFixed(2);
            let row = { cashout: randomValue, server_seed: serverSeed, client_seed: clientSeed, hash, game_nonce: nonce }
            return row;
        }
        let kjks = generateRandomNumber(e.server_seed, e.client_seed, e.hash_seed, e.nonce)
        handleMybet(kjks, e)
    })

    let active_crash = []
    const handleCrashActiveBet = ((event)=>{
        if(active_crash.length > 30){
            active_crash.shift()
            active_crash.push(event)
        }else{
            active_crash.push(event)
        }
        io.emit("active-bets-crash", active_crash)
    })


    let newMessage = await Chats.find()
    const handleNewChatMessages = (async (data) => {
        io.emit("new-messages", newMessage)
        await Chats.create(data)
    })

    //Live Bet Update
    const latestBetUpdate = async (data, game) => {
        const user = await Profile.findById(data.user_id)
        const stats = {
            gane_type: game,
            player: user.hidden_from_public ? user.username : "Hidden",
            bet_id: data.bet_id,
            token_img: data.token_img,
            payout: data.has_won ? ((data.wining_amount/data.bet_amount) * 100) : ((data.bet_amount/data.bet_amount) * 100),
            profit_amount: data.has_won ? data.wining_amount : data.bet_amount,
        }
        return stats
    }

    io.on("connection", (socket) => {
        socket.on("dice-bet", data => {
            handleDicePoints(data)
            //Get New Bet and Update Latest Bet UI
            const latestBet = latestBetUpdate(data, "Dice Game")
            io.emit("latest-bet", latestBet)
        })

        socket.on("message", data => {
            newMessage.push(data)
            handleNewChatMessages(data)
        })

        socket.on("crash-activebet", data => {
            handleCrashActiveBet(data)
            //Get New Bet and Update Latest Bet UI
            const latestBet = latestBetUpdate(data, "Crash Game")
            io.emit("latest-bet", latestBet)
        })

        //HILO GAME
        socket.on("hilo-init", data => {
            initHiloGame(data, (event, payload) => {
                io.emit(event, payload);
            });
        });
        socket.on("hilo-bet", data => {
            
            handleHiloBet(data, (event, payload) => {
                io.emit(event, payload);
            });
        });
        socket.on("hilo-cashout", data => {
            handleHiloCashout(data, (event, payload) => {
                io.emit(event, payload);
            });
        });
        socket.on("hilo-next-round", data => {
            handleHiloNextRound(data, (event, payload) => {
                io.emit(event, payload);
            });
        });
    })

}

module.exports = { createsocket }