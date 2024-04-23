const mongoose = require("mongoose");
const SwapHistory = require("../../model/transactionHistoryModels/SwapHistory");

const getSwapHistory = ( async (req, res) => {
    try{
        const {user_id} = req.id;
        const current_user_transaction_history = await SwapHistory.find({user_id });
        res.status(200).json(current_user_transaction_history);
    }catch(error){
        console.log(error);
    }})

    module.exports = { getSwapHistory };
