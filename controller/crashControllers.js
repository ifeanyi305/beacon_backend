const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const crash_game = require("../model/crashgame")
const USDT_wallet = require("../model/Usdt-wallet")
const PPFWallet = require("../model/PPF-wallet")
const Bills = require("../model/bill")
const CrashHistory = require("../model/crash-game-history")

const updateUserWallet = (async(data)=>{
  if(data.bet_token_name === "PPF"){
    await PPFWallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  }
 if(data.bet_token_name === "USDT"){
    await USDT_wallet.updateOne({ user_id:data.user_id }, {balance: data.current_amount});
  } 
})

const CraeatBetGame = (async(data)=>{
  try {
  await crash_game.create(data)

} catch (err) {
  console.error(err);
}
})


const handleSaveBills = (async(data)=>{
 await Bills.create(data)
})

let hidden = false
const handleCrashBet = (async(req, res)=>{
  try {
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data
  let game_type = "Classic"
  if(sent_data.bet_token_name !== "PPF"){
    handleWagerIncrease(user_id, sent_data.bet_amount, sent_data.bet_token_img)
  }
  let current_amount; 
  if(sent_data.bet_token_name === "PPF"){
    let skjk = await PPFWallet.find({user_id})
    current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
  }
  
  if(sent_data.bet_token_name === "USDT"){
    let skjk = await USDT_wallet.find({user_id})
    current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
  }

  let bet = {
    user_id: user_id,
    username: data.username,
    profile_img: data.user_img,
    bet_amount: data.bet_amount,
    token: data.bet_token_name,
    token_img:data.bet_token_img,
    bet_id: Math.floor(Math.random()*10000000)+ 72000000,
    game_id: data.game_id,
    cashout: 0,
    auto_cashout: data.auto_cashout,
    profit: 0,
    game_hash: "-",
    hidden_from_public:hidden,
    game_type: game_type,
    user_status: true,
    game_status: true,
    time: data.time,
    payout: 0.0000,
    has_won : 0 ,
    chance: data.chance
  }
    CraeatBetGame(bet)
    updateUserWallet({ ...sent_data, user_id, current_amount})
    res.status(200).json({...bet, current_amount })
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const handleUpdateCrashState = async(event)=>{
  await crash_game.updateOne({ user_id:event.user_id, game_id:event.game_id }, 
  {cashout: event.crash, 
    profit:event.profit,
    user_status:false ,
    has_won: true
   });
}

const handleCashout = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data
  try {
    let current_amount; 
    if(sent_data.bet_token_name === "PPF"){
      let skjk = await PPFWallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
    }
  
    if(sent_data.bet_token_name === "USDT"){
      let skjk = await USDT_wallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) + parseFloat(sent_data.cashout_at)
    }

  //   let bil = {
  //     user_id: user_id,
  //     transaction_type: "Crash normal",
  //     token_img:data.bet_token_img,
  //     token_name:data.bet_token_name,
  //     balance: current_amount,
  //     trx_amount:data.cashout_at ,
  //     datetime: currentTime,
  //     status: true,
  //     bill_id: data.game_id
  //  }
  
  //  handleSaveBills(bil)
  
    handleUpdateCrashState({...sent_data, user_id, current_amount:current_amount })
    updateUserWallet({current_amount, ...sent_data, user_id})
      res.status(200).json({...sent_data, balance:current_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

const handleRedTrendball = (async(req, res)=>{
  const {user_id} = req.id
  const {data} = req.body
  let sent_data = data

  if(sent_data.bet_token_name !== "PPF"){
    //TODO: check if bet_token_img exist
    handleWagerIncrease({user_id, bet_amount: sent_data.bet_amount, token: sent_data.bet_token_img })
  }

  try {
    let current_amount; 
    if(sent_data.bet_token_name === "PPF"){
      let skjk = await PPFWallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
    }
  
    if(sent_data.bet_token_name === "USDT"){
      let skjk = await USDT_wallet.find({user_id})
      current_amount = parseFloat(skjk[0].balance) - parseFloat(sent_data.bet_amount)
    }
    CraeatBetGame({...sent_data, hidden, user_id})
    updateUserWallet({ ...sent_data, user_id, current_amount})
    res.status(200).json({...sent_data,current_amount})
  } catch (err) {
    res.status(501).json({ message: err.message });
    console.log(err)
  }
})

const handleCrashHistory = (async(req, res)=>{
  try{
    const data = await CrashHistory.find()
    res.status(200).json(data)
  }catch(error){
    res.status(500).json({error})
  }
})

const handleMybets = (async(req, res)=>{
  try{
    const {user_id} = req.id
    const data = await crash_game.find({user_id, game_status: false})
    res.status(200).json(data)
  }catch(error){
    res.status(500).json({error})
  }
})

module.exports = { handleCrashBet, handleCashout ,handleCrashHistory, handleRedTrendball, handleMybets}
