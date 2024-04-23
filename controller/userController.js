const jwt = require('jsonwebtoken');
const User = require("../model/User")
const Profile = require("../model/Profile")
const Wallet = require("../model/wallet")
const { createProfile } = require("./profileControllers")
var SECRET = `highscoretechBringwexsingthebestamoung23498hx93`
const { format } = require('date-fns');
const { createCashbackTable } = require("../profile_mangement/cashbacks")
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const Chats = require("../model/public-chat")
const {createPPF, createPPL, createPPD, createUsdt, handleDefaultWallet  } = require("../wallet_transaction/index")
const { InitializeDiceGame } = require("../controller/diceControllers")
const { CreateAffiliate, CheckValidity } = require("./affiliateControllers")
const { handleCreatePPDunlocked } = require("../profile_mangement/ppd_unlock")
const { handleNewNewlyRegisteredCount } = require("../profile_mangement/cashbacks")
const { InitializeMinesGame } = require("../controller/minesControllers")
const {twoFactorAuth} = require("../utils/twoFactorAuth");
const { twoFactorAuthVerify } = require('../utils/twoFactorAuthVerify');
const createToken = ((_id)=>{
   return  jwt.sign({_id}, SECRET, { expiresIn: '4d' })
})


// Signup controller
const CreateAccount = (async (req, res)=>{ 
    const data = req.body
    let email = (data.user.email)
    let emailVerified = (data.user.emailVerified)
    let google_auth = false
    let user_id = (data.user.uid)
    const created_at = currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let password =  (data.user.apiKey)
    let provider =  (data.user.providerData[0].providerId)
    let invited_code = ""
    let username = data.user.displayName

    const fullData = {
        email, user_id, created_at, lastLoginAt, password, provider, emailVerified, google_auth,last_login_ip
    }
    const exist = await User.findOne({ user_id })
    if(!exist){
        try{
        await User.create(fullData)
        createPPF(user_id)
        createPPL(user_id)
        createPPD(user_id)
        createUsdt(user_id)
        InitializeDiceGame(user_id)
        createCashbackTable(user_id)
        InitializeMinesGame(user_id)
        handleCreatePPDunlocked(user_id)
        CreateAffiliate(user_id)
        const Token = createToken(user_id)
        const default_wallet = await handleDefaultWallet(user_id)
        let result = await createProfile(email, username, invited_code, user_id )
         res.status(200).json({Token,default_wallet,result })
        }
        catch(err){
           res.status(401).json({error: err})
        }

    }else{
        const result = await Profile.find({user_id})
        const default_wallet = await Wallet.find({user_id})
        const Token = createToken(user_id)
        res.status(200).json({Token,default_wallet:default_wallet[0],result: result[0] })
    }
})

const Register = (async(req, res)=>{
    const data = req.body
    let email = (data.user.email)
    let emailVerified = (data.user.emailVerified)
    let google_auth = false
    let user_id = (data.user.uid)
    const created_at =  currentTime
    const lastLoginAt = currentTime
    const last_login_ip = req.socket.remoteAddress
    let password =  (data.user.apiKey)
    let provider =  (data.user.providerData[0].providerId)
    let username = ''
    let invited_code = data.reff
    const fullData = {
        email, user_id, created_at, lastLoginAt, password, provider, emailVerified, google_auth,last_login_ip
    }
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function generateString(length) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    let result = {
        born: "-",
        firstname: '-',
        lastname: '-',
        user_id: user_id,
        email : email,  
        hide_profile: false,
        hidden_from_public: false,
        refuse_friends_request: false,
        refuse_tips: false, 
        username : username ? username : generateString(9).toString(),  
        profile_image: "https://img2.nanogames.io/avatar/head1.png",
        vip_level: 0,
        kyc_is_activated: false,
        phone: "-",
        next_level_point:1,
        total_wagered: 0,
        invited_code: invited_code ? invited_code : "-",
        google_auth_is_activated : false,
        is_suspend: false,
        vip_progress: 0,
        fa_is_activated: false,   
        earn_me: 0,
        commission_reward: 0,
        usd_reward : 100, 
        joined_at: currentTime,
        account_type: "normal",
        total_chat_messages:0,
        weekly_wagered: 0,
        monthly_wagered: 0
    }
    if(invited_code){
        let validateCode = await CheckValidity(invited_code,user_id )
        if(validateCode){
            invited_code = validateCode
        }
        
    }
    const exist = await User.findOne({ user_id })
    if(!exist){
        try{
            await User.create(fullData)
            createPPF(user_id)
            createPPL(user_id)
            createPPD(user_id)
            createUsdt(user_id)
            InitializeDiceGame(user_id)
            InitializeMinesGame(user_id)
            createCashbackTable(user_id)
            CreateAffiliate(user_id)
            handleCreatePPDunlocked(user_id)
            const Token = createToken(user_id)
            let wallet =  handleDefaultWallet()
            createProfile(result)
            res.status(200).json({Token,wallet:wallet,result })
        }
        catch(err){
           res.status(401).json({error: err})
        }
    }else{
        const result = await Profile.find({user_id})
        const default_wallet = await Wallet.find({user_id})
        const Token = createToken(user_id)
        res.status(200).json({Token,default_wallet:default_wallet[0],result: result[0] })
    }
})


// get a user profile by id
const SingleUserByID = (async(req, res)=>{
    const {id} = req.params;
    try{
        const users =  await Profile.find({user_id:id})
        res.status(200).json(users)
    }
    catch(error){
        res.status(500).json({error})
    }
})


// ============= get previous messages ====================
const previousChats = (async(req, res)=>{
    try{
        let newMessage = await Chats.find()
        res.status(200).json(newMessage)
    }
    catch(err){
        res.status(500).json({error: err})
    }
})

const mentionUsers = (async (req, res, next) => {
    try {
      const usernames = await Profile.find()
      const usernamesArray = usernames.map(obj => obj.username);
      return res.status(200).json(usernamesArray)
    }
    catch (error) {
      console.log(error.message)
    }
  })

const twoFacAuth =  (async (req, res) => {
    await twoFactorAuth(req, res);
})

const twoFacAuthVerify =  (async (req, res) => {
    await twoFactorAuthVerify(req, res);
})




module.exports = { 
    CreateAccount, 
    Register, 
    previousChats,
    SingleUserByID,
    twoFacAuth,
    twoFacAuthVerify,
    mentionUsers
}