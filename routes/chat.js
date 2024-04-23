const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

//Coin Tip
router.post('/tip', async(req, res, next) => {
    const { amount, token, user_id, sender_user_id } = req.body

    if (amount === '' || token === '' || user_id === ''|| sender_user_id === '') {
        return res.status(401).json({
            success: false,
            message: "One of the required field is missing"
          })
    }
try {
    if(token === 'USDT'){
        const sendersBalance = await UsdtWallet.findOne({ user_id: sender_user_id })
        const receiverBalance = await UsdtWallet.findOne({ user_id: user_id })
        if(!(sendersBalance.balance >= amount)){
          return res.status(401).json({
            success: false,
            message: "Insuficient Balance"
          })
        }
        const senderNewBalance = sendersBalance.balance - amount
        const receiverNewBalance = receiverBalance.balance + amount

         await UsdtWallet.updateOne({ user_id: sender_user_id }, {
             $set: {
                 balance: senderNewBalance
             }
         })

         await UsdtWallet.updateOne({ user_id: user_id }, {
             $set: {
                 balance: receiverNewBalance
             }
         })
        return res.json({
            suucess: true,
            message: "USDT Tip successfully sent",
            initial_balance: sendersBalance.balance,
            new_balance: senderNewBalance
        })
    }else if(token === 'PPD'){
        const sendersBalance = await PPDWallet.findOne({ user_id: sender_user_id })
        const receiverBalance = await PPDWallet.findOne({ user_id: user_id })
        if(!(sendersBalance.balance >= amount)){
          return res.status(401).json({
            success: false,
            message: "Insuficient Balance"
          })
        }
        const senderNewBalance = sendersBalance.balance - amount
        const receiverNewBalance = receiverBalance.balance + amount

         await PPDWallet.updateOne({ user_id: sender_user_id }, {
             $set: {
                 balance: senderNewBalance
             }
         })

         await PPDWallet.updateOne({ user_id: user_id }, {
             $set: {
                 balance: receiverNewBalance
             }
         })
         return res.json({
            suucess: true,
            message: "PPD Tip successfully sent",
            initial_balance: sendersBalance.balance,
            new_balance: senderNewBalance
        })
    }
}catch(err){
    console.log(err)
}
    
})
//Coin Rain
router.post('/rain', async(req, res, next) => {
    const { amount, token, random_selected_of_people , sender_user_id } = req.body 
    if (amount === '' || token === '' || random_selected_of_people === ''|| sender_user_id === '') {
        return res.status(401).json({
            success: false,
            message: "One of the required field is missing"
          })
    }
    const coinFraction = (amount/random_selected_of_people.length)
try {
    if(token === 'USDT'){
        const sendersBalance = await UsdtWallet.findOne({ user_id: sender_user_id })
        if(!(sendersBalance.balance >= amount)){
          return res.status(401).json({
            success: false,
            message: "Insuficient Balance"
          })
        }
        random_selected_of_people.forEach(async(id) => {
            const receiverBalance = await UsdtWallet.findOne({ user_id: id })
                const senderNewBalance = sendersBalance.balance - amount
                const receiverNewBalance = receiverBalance.balance + coinFraction
          
                
                 await UsdtWallet.updateOne({ user_id: sender_user_id }, {
                     $set: {
                         balance: senderNewBalance
                     }
                 })
        
                 await UsdtWallet.updateOne({ user_id: id }, {
                     $set: {
                         balance: receiverNewBalance
                     }
                 })
        })
        
        return res.json({
            suucess: true,
            message: "USDT Rain Drop successfully sent",
        })
    }else if(token === 'PPD'){
        const sendersBalance = await PPDWallet.findOne({ user_id: sender_user_id })
        if(!(sendersBalance.balance >= amount)){
          return res.status(401).json({
            success: false,
            message: "Insuficient Balance"
          })
        }
        random_selected_of_people.forEach(async(id) => {
            const receiverBalance = await PPDWallet.findOne({ user_id: id })
                const senderNewBalance = sendersBalance.balance - coinFraction
                const receiverNewBalance = receiverBalance.balance + coinFraction
        
                 await PPDWallet.updateOne({ user_id: sender_user_id }, {
                     $set: {
                         balance: senderNewBalance
                     }
                 })
        
                 await PPDWallet.updateOne({ user_id: id }, {
                     $set: {
                         balance: receiverNewBalance
                     }
                 })
        })
        
        return res.json({
            suucess: true,
            message: "PPD Rain Drop successfully sent",
            initial_balance: sendersBalance.balance
        })
    }
}catch(err){
    console.log(err)
}
})
//Coin Drop
router.post('/drop', async(req, res, next) => {
    const { amount, token, random_selected_of_people , sender_user_id } = req.body 
    if (amount === '' || token === '' || random_selected_of_people === ''|| sender_user_id === '') {
        return res.status(401).json({
            success: false,
            message: "One of the required field is missing"
          })
    }
    const coinFraction = (amount/random_selected_of_people.length)
try {
    if(token === 'USDT'){
        const sendersBalance = await UsdtWallet.findOne({ user_id: sender_user_id })
        if(!(sendersBalance.balance >= amount)){
          return res.status(401).json({
            success: false,
            message: "Insuficient Balance"
          })
        }
        random_selected_of_people.forEach(async(id) => {
            const receiverBalance = await UsdtWallet.findOne({ user_id: id })
                const senderNewBalance = sendersBalance.balance - amount
                const receiverNewBalance = receiverBalance.balance + coinFraction
          
                
                 await UsdtWallet.updateOne({ user_id: sender_user_id }, {
                     $set: {
                         balance: senderNewBalance
                     }
                 })
        
                 await UsdtWallet.updateOne({ user_id: id }, {
                     $set: {
                         balance: receiverNewBalance
                     }
                 })
        })
        
        return res.json({
            suucess: true,
            message: "USDT Rain Drop successfully sent",
        })
    }else if(token === 'PPD'){
        const sendersBalance = await PPDWallet.findOne({ user_id: sender_user_id })
        if(!(sendersBalance.balance >= amount)){
          return res.status(401).json({
            success: false,
            message: "Insuficient Balance"
          })
        }
        random_selected_of_people.forEach(async(id) => {
            const receiverBalance = await PPDWallet.findOne({ user_id: id })
                const senderNewBalance = sendersBalance.balance - coinFraction
                const receiverNewBalance = receiverBalance.balance + coinFraction
        
                 await PPDWallet.updateOne({ user_id: sender_user_id }, {
                     $set: {
                         balance: senderNewBalance
                     }
                 })
        
                 await PPDWallet.updateOne({ user_id: id }, {
                     $set: {
                         balance: receiverNewBalance
                     }
                 })
        })
        
        return res.json({
            suucess: true,
            message: "PPD Rain Drop successfully sent",
            initial_balance: sendersBalance.balance
        })
    }
}catch(err){
    console.log(err)
}
})

// auth middleware
router.use(requireAuth)
const { ChatMessages } = require('../controller/chatMessage')
const UsdtWallet = require('../model/Usdt-wallet')
const PPDWallet = require('../model/PPD-wallet')

router.post('/', ChatMessages)



module.exports = router