const crypto = require('crypto');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const DiceEncription = require("../model/dice_encryped_seeds")
const DiceGame = require("../model/dice_game")
const Wallet = require("../model/wallet")
const USDTWallet = require("../model/Usdt-wallet")
const PPFWallet = require("../model/PPF-wallet")

let nonce = 0
let maxRange = 100
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
function generateRandomNumber(serverSeed, clientSeed, hash) {
  nonce += 1
  const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}`;
  const hmac = crypto.createHmac('sha256', combinedSeed);
  const hmacHex = hmac.digest('hex');
  const decimalValue = (parseInt(hmacHex, 32) % 10001 / 100)
  const randomValue = (decimalValue % maxRange).toFixed(2);
  let row = { point: randomValue, server_seed: serverSeed, client_seed: clientSeed, nonce }
  return row;
}

const updateUserWallet = (async (data) => {
  await Wallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
  if (data.bet_token_name === "PPF") {
    await PPFWallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
  }
  else if (data.bet_token_name === "USDT") {
    await USDTWallet.updateOne({ user_id: data.user_id }, { balance: data.current_amount });
  }
})


const handleDiceBet = (async (user_id, data, result) => {
  const CraeatBetGame = (async (rt) => {
    let bet = {
      user_id: user_id,
      username: rt.username,
      profile_img: rt.profile_img,
      bet_amount: rt.bet_amount,
      token: rt.bet_token_name,
      token_img: rt.bet_token_img,
      bet_id: Math.floor(Math.random() * 10000000) + 72000000,
      cashout: rt.io,
      profit: rt.payoutIO,
      client_seed: rt.client_seed ? rt.client_seed : "-",
      server_seed: rt.server_seed ? rt.server_seed : "-",
      time: rt.time,
      hidden_from_public: rt.hidden,
      payout: rt.payout,
      has_won: rt.has_won,
      chance: rt.chance,
      game_nonce: rt.nonce ? rt.nonce : "-"
    }

    try {
      await DiceGame.create(bet)
      await DiceEncription.updateOne({ user_id }, {
        nonce: rt.nonce
      })``
    }

    catch (error) {
      console.log(error)
    }
  })
  let hidden;
  if (data.bet_token_name !== "PPF") {
    await handleWagerIncrease({ user_id, bet_amount: data.bet_amount, token: data.bet_token_img })
  }
  if (parseFloat(data.chance) > parseFloat(result.point)) {
    try {
      let sjbhsj = await Wallet.find({ user_id })
      if (sjbhsj[0].hidden_from_public) {
        hidden = true
      } else {
        hidden = false
      }
      let previous_bal = parseFloat(sjbhsj[0].balance)
      let wining_amount = parseFloat(data.wining_amount)
      let current_amount = (previous_bal + wining_amount).toFixed(4)
      updateUserWallet({ current_amount, ...data, user_id })
      await CraeatBetGame({ ...data, user_id, payoutIO: wining_amount, hidden, has_won: true, io: parseFloat(result.point), result, current_amount })
    } catch (err) {
      console.log({ message: err.message });
    }
  } else {
    try {
      let response = await Wallet.find({ user_id })
      if (response[0].hidden_from_public) {
        hidden = true
      } else {
        hidden = false
      }
      let previous_bal = parseFloat(response[0].balance)
      let bet_amount = parseFloat(data.bet_amount)
      let current_amount = (previous_bal - bet_amount).toFixed(4)
      CraeatBetGame({ ...data, user_id, payoutIO: 0, hidden, has_won: false, io: parseFloat(result.point), current_amount })
      updateUserWallet({ current_amount, ...data, user_id })
    } catch (err) {
      console.log({ message: err.message });
    }
  }
})

const HandlePlayDice = ((req, res) => {
  const { user_id } = req.id
  let { data } = req.body
  function generateRandomNumber(serverSeed, clientSeed, hash, nonce) {
    const combinedSeed = `${serverSeed}-${clientSeed}-${hash}-${nonce}-${salt}`;
    const hmac = crypto.createHmac('sha256', combinedSeed);
    const hmacHex = hmac.digest('hex');
    const decimalValue = (parseInt(hmacHex, 32) % 10001 / 100)
    const randomValue = (decimalValue % maxRange).toFixed(2);
    let row = { point: randomValue, server_seed: serverSeed, client_seed: clientSeed, hash, nonce }
    return row;
  }
  // handleDiceBet(user_id,data, generateRandomNumber(data.server_seed,data.client_seed, data.hash_seed,data.nonce ))
  res.status(200).json(generateRandomNumber(data.server_seed, data.client_seed, data.hash_seed, data.nonce))
})

const seedSettings = (async (req, res) => {
  const { user_id } = req.id
  let { data } = req.body
  const handleHashGeneration = (() => {
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const clientSeed = data;
    const combinedSeed = serverSeed + salt + clientSeed;
    const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
    return hash
  })
  try {
    let client_seed = data
    let server_seed = handleHashGeneration()
    nonce = 0
    await DiceEncription.updateOne({ user_id }, {
      server_seed: server_seed,
      client_seed: client_seed,
      updated_at: new Date()
    })
    console.log(client_seed)
    res.status(200).json("Updated sucessfully")
  }
  catch (err) {
    res.status(501).json({ message: err });
  }
})

const getDiceGameHistory = (async (req, res) => {
  const { user_id } = req.id
  try {
    let diceGameHistory = await DiceGame.find({ user_id });
    res.status(200).json(diceGameHistory);
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})


// ============================== Initialize dice game ===============================
const InitializeDiceGame = (async (user_id) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';

  const handleHashGeneration = (() => {
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const clientSeed = generateString(23);
    const combinedSeed = serverSeed + salt + clientSeed;
    const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
    let encrypt = { hash, clientSeed, serverSeed }
    return encrypt
  })
  const {serverSeed: server_seed, hash: hash_seed, clientSeed: client_seed } = handleHashGeneration();
  let data = {
    user_id: user_id,
    nonce: 0,
    server_seed,
    hash_seed,
    client_seed,
    is_open: false,
    updated_at: currentTime
  }
  await DiceEncription.create(data)
})

const handlePrev_Games = (async (req, res) => {
  const user_id = req.id
})

const UpdateWins = (async(req, res)=>{
    try{
      const { user_id } = req.id
      const { data } = req.body
     await minesgameInit.updateOne({user_id, active: true },{
        gameLoop: data
      })
      // let sdff = await minesgameInit.find({user_id, active: true})
      // console.log(sdff)
      res.status(200).json({message: "Game saved"})
    }
    catch(error){
      res.status(500).json({message: error})
    }
})


const handleDiceGameEncryption = (async (req, res) => {
  const { user_id } = req.id
  try {
    let result = await DiceEncription.find({ user_id })
    res.status(200).json(result)
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = { handleDiceBet, getDiceGameHistory, seedSettings, handleDiceGameEncryption, InitializeDiceGame, HandlePlayDice, handlePrev_Games }