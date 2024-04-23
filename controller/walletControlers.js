const Wallet = require("../model/wallet")
const PPDWallet = require("../model/PPD-wallet")
const PPLWallet = require("../model/PPL-wallet")
const PPFWallet = require("../model/PPF-wallet")
const USDTWallet = require("../model/Usdt-wallet")

// ============= get wallet  ====================
const GetPPDWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    }
    else {
      try {
        const users = await PPDWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetPPFWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await PPFWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})


const GetPPLWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await PPLWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

// const GetPPLWallet = (async(req, res)=>{
//     const {user_id} = req.id;
//     if (!user_id) {
//       res.status(500).json({ error: "No user found" });
//     } else {
//       try {
//         const users = await WGDWallet.find({user_id})
//         res.status(200).json(users)
//       } catch (err) {
//         res.status(501).json({ message: err.message });
//       }
//     }
// })

const GetUSDTWallet = (async(req, res)=>{
    const {user_id} = req.id;
    if (!user_id) {
      res.status(500).json({ error: "No user found" });
    } else {
      try {
        const users = await USDTWallet.find({user_id})
        res.status(200).json(users)
      } catch (err) {
        res.status(501).json({ message: err.message });
      }
    }
})

const GetDefaultWallet = (async(req, res)=>{
  const {user_id} = req.id;
  if (!user_id) {
    res.status(500).json({ error: "No user found" });
  } else {
    try {
      const users = await Wallet.find({user_id})
      res.status(200).json(users)
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
  }
})

const UpdatedefaultWallet = (async(req, res)=>{
  const {user_id} = req.id;
  const data = req.body
  try {
 await USDTWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "USDT" ? true : false
   });

   await PPFWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "PPF" ? true : false
   });

   await PPDWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "PPD" ? true : false
   });
   await PPLWallet.updateOne({ user_id }, {
    is_active: data.coin_name === "PPL" ? true : false
   });

  } catch (err) {
    res.status(501).json({ message: err.message });
  }
})

module.exports = {  GetPPDWallet, GetPPFWallet, GetPPLWallet, GetUSDTWallet, UpdatedefaultWallet, GetDefaultWallet, UpdatedefaultWallet}