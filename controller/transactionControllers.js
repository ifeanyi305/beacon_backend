const crypto = require("crypto")
const uuid1 = crypto.randomUUID()
const { format } = require('date-fns');
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const Wallet = require("../model/wallet")
const USDT_wallet = require("../model/Usdt-wallet")
const PPD_wallet = require("../model/PPD-wallet")
const PPL_wallet = require("../model/PPL-wallet");
const bill = require("../model/bill");
const UsdtWallet = require("../model/Usdt-wallet");
const { usdtIcon, pplIcon, ppdIcon } = require("../lib/coinIcons");
const { updateSwapHistory } = require("./transactionHistories/updateSwapHistory");


const handleSwap = (async (req,res)=>{
    console.log(req.body.amount, typeof req.body.amount);
    const {user_id} = req.id;
    // const user_id = "6543bb0691475af55146493b";
    const data = req.body;
    const swappingDetails = data;



    const deductFromWalletBalance = async(wallet, amount, user_id) => {
        const wallet_details = await wallet.findOne({user_id});
        if(wallet_details){
            const available_balance = wallet_details.balance;
            const new_balance = parseFloat(available_balance) - parseFloat(amount);
            await wallet.findOneAndUpdate({user_id}, {balance: new_balance});
        }
    }
    
    const addToWalletBalance = async(wallet, amount, user_id) => {
        let new_balance = amount;
        const wallet_details = await wallet.findOne({user_id});
        if(wallet_details){
            const available_balance = wallet_details.balance;
            new_balance = parseFloat(available_balance) + parseFloat(amount);
            await wallet.findOneAndUpdate({user_id}, {balance: new_balance});
        }
    }
    
    const checkWalletBalance = async (wallet, amount, user_id) => {
        const wallet_details = await wallet.findOne({user_id});
        if(wallet_details){
            const available_balance = wallet_details.balance;
            if(parseFloat(available_balance) < parseFloat(amount)){
                return false;
            }
            return true;
        }
        return false;
    }

    //Done
    const sendResponseAfterSwap = async (res, senderCoin, receiverCoin) => {
        const USDT_wallet_detail = await USDT_wallet.findOne({user_id});
        const PPD_wallet_detail = await PPD_wallet.findOne({user_id});
        const PPL_wallet_detail = await PPL_wallet.findOne({user_id});
        res.status(200).json({
            message: `You've successfully swapped from ${senderCoin} to ${receiverCoin}`,
            coins:[USDT_wallet_detail, PPD_wallet_detail, PPL_wallet_detail]
        })
    }

    const swap_PPL_to_PPD = async (req, res) => {
        const senderCoinIcon = pplIcon;
        const receiverCoinIcon = ppdIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPD = amountToBeSwapped / 10;
        if(await checkWalletBalance(PPL_wallet, amountToBeSwapped, user_id)){
            await deductFromWalletBalance(PPL_wallet, amountToBeSwapped, user_id);
            await addToWalletBalance(PPD_wallet, equivalentAmountInPPD, user_id );
            await updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPL_wallet, PPD_wallet);
            await sendResponseAfterSwap(res, "PPL", "PPD");
        }else{
            res.status(403).json({messsage: "Insufficient fund"})
        }
    }
    
    const swap_PPL_to_USDT = async (req, res) => {
        const senderCoinIcon = pplIcon;
        const receiverCoinIcon = usdtIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInUSDT = amountToBeSwapped / 10;
        if(await checkWalletBalance(PPL_wallet, amountToBeSwapped, user_id)){
            await deductFromWalletBalance(PPL_wallet, amountToBeSwapped, user_id);
            await addToWalletBalance(USDT_wallet, equivalentAmountInUSDT, user_id );
            await updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPL_wallet, USDT_wallet);
            await sendResponseAfterSwap(res, "PPL", "USDT");
        }else{
            res.status(403).json({message: "Insufficient fund"})
        }
    }
    
    const swap_PPD_to_PPL = async (req, res) => {
        const senderCoinIcon = ppdIcon;
        const receiverCoinIcon = pplIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPL = amountToBeSwapped * 10;
        if(await checkWalletBalance(PPD_wallet, amountToBeSwapped, user_id)){
            await deductFromWalletBalance(PPD_wallet, amountToBeSwapped, user_id);
            await addToWalletBalance(PPL_wallet, equivalentAmountInPPL, user_id );
            await updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPD_wallet, PPL_wallet);
            await sendResponseAfterSwap(res, "PPD", "PPL");
        }else{
            res.status(403).json({message: "Insufficient fund"})
        }
    }
    
    const swap_PPD_to_USDT = async (req, res) => {
        const senderCoinIcon = ppdIcon;
        const receiverCoinIcon = usdtIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPL = amountToBeSwapped * 1;

        if(await checkWalletBalance(PPD_wallet, amountToBeSwapped, user_id)){
            await deductFromWalletBalance(PPD_wallet, amountToBeSwapped, user_id);
            await addToWalletBalance(USDT_wallet, equivalentAmountInPPL, user_id );
            await updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, PPD_wallet, USDT_wallet);
            await sendResponseAfterSwap(res, "PPD", "USDT");
        }else{
            res.status(403).json({message: "Insufficient fund"});
        }
    }
    
    const swap_USDT_to_PPL = async (req, res) => {
        const senderCoinIcon = usdtIcon;
        const receiverCoinIcon = pplIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPL = amountToBeSwapped * 10;
        if(await checkWalletBalance(USDT_wallet, amountToBeSwapped, user_id)){
            await deductFromWalletBalance(USDT_wallet, amountToBeSwapped, user_id);
            await addToWalletBalance(PPL_wallet,equivalentAmountInPPL, user_id );
            await updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, USDT_wallet, PPL_wallet);
            await sendResponseAfterSwap(res, "USDT", "PPL");
        }else{
            res.status(403).json({message: "Insufficient fund"})
        }
    }
    
    const swap_USDT_to_PPD = async (req, res) => {
        const senderCoinIcon = usdtIcon;
        const receiverCoinIcon = ppdIcon;
        const amountToBeSwapped = swappingDetails.amount;
        const equivalentAmountInPPD = amountToBeSwapped * 1;
        if(await checkWalletBalance(USDT_wallet, amountToBeSwapped, user_id)){
            await deductFromWalletBalance(USDT_wallet, amountToBeSwapped, user_id);
            await addToWalletBalance(PPD_wallet, equivalentAmountInPPD, user_id );
            await updateSwapHistory(swappingDetails, user_id, senderCoinIcon, receiverCoinIcon, amountToBeSwapped, USDT_wallet, PPD_wallet);
            await sendResponseAfterSwap(res, "USDT", "PPD");
        }else{
            res.status(403).json({message: "Insufficient fund"})
        }
    }
    

        const senderCoin = swappingDetails.senderCoin; 
        const recieverCoin = swappingDetails.receiverCoin;

        if(senderCoin == "USDT" && recieverCoin == "PPD"){
            await swap_USDT_to_PPD(req, res);
        }

        if(senderCoin == "USDT" && recieverCoin == "PPL"){
            await swap_USDT_to_PPL(req, res);
        }

        if(senderCoin == "PPD" && recieverCoin == "USDT"){
            await swap_PPD_to_USDT(req, res);
        }

        if(senderCoin == "PPD" && recieverCoin == "PPL"){
            await swap_PPD_to_PPL(req, res);
        }

        if(senderCoin == "PPL" && recieverCoin == "USDT"){
            await swap_PPL_to_USDT(req, res);
        }

        if(senderCoin == "PPL" && recieverCoin == "USDT"){
            await swap_PPL_to_PPD(req, res);
        }



    // const setCoinIcon = (data) => {
    //     // let event_timedate =currentTime
    //     // sender DB
    //     // let gdrrx = await Wallet.find({user_id})
    //     // let jkdrrex = number(gdrrx[0].balance)
    //     // handleOlderSenderBal(jkdrrex)

    //     // let wallet = ''
    //     // Sender Wallet
    //     if(data.senderCoin === "USDT"){
    //         // wallet = `usdt_wallet` 
    //         sender_img = "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
    //     }
    //     else if(data.senderCoin === "PPD"){
    //         // wallet = `ppd_wallet` 
    //         sender_img = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1697828435/dpp_logo_sd2z9d.png"
    //     }
    //     else if(data.senderCoin === "PPL"){
    //         // wallet = `ppl_wallet` 
    //         sender_img = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1698011384/type_1_w_hqvuex.png"
    //     }
        
    // }
})


const handleBills = (async(req,res)=>{
    const { user_id } = req.id
    if(user_id){
        let jjsaa = await bill.find({user_id})
        res.status(200).json(jjsaa)
    }else{
        res.status(401).json({error: "Invalid user"})
    }
})



module.exports = { handleSwap, handleBills }
