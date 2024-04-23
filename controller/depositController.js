const { default: axios } = require("axios");
const crypto = require("crypto");
const DepositRequest = require("../model/deposit_request")
const USDTwallet = require("../model/Usdt-wallet")
const CCPAYMENT_API_ID = "202310051818371709996528511463424";
const CC_APP_SECRET = "206aed2f03af1b70305fb11319f2f57b";
const CCPAYMENT_API_URL = "https://admin.ccpayment.com";
const { handleProfileTransactions } = require("../profile_mangement/index")
const { handlePPDunLockUpdate } = require("../profile_mangement/ppd_unlock")
const { handleTotalNewDepsitCount } = require("../profile_mangement/cashbacks");
const { updateDepositHistory } = require("./transactionHistories/updateDepositHistory");

const RequestTransaction = (async(event)=>{
  // Get the current date and time
const currentDate = new Date();
// Calculate the date and time 16 hours from now
const futureDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
  let data = {
    user_id: event.user_id,
    order_id: event.data.order_id,
    amount: event.data.amount,
    crypto: event.data.crypto,
    network: event.data.network,
    pay_address: event.data.pay_address,
    token_id: event.data.token_id,
    order_valid_period: event.data.order_valid_period,
    time: new Date(),
    expire_in: futureDate,
    merchant_order_id: event.merchant_order_id,
    contract: "-",
    status: "Pending"
  }
  if(event.msg === "success"){
    await DepositRequest.create(data)
  }else{
    console.log("something went wrong")
  }
})

const handleFirstDeposit = ((user_id, amount, num)=>{
    let data = {
      user_id,
      amount,
      date: new Date()
    }
    let bonus
    if(num < 1){
     bonus = amount * (180 / 100)
    }
    else if(num === 1){
      bonus = amount * (240 / 100)
    }
    else if(num === 2){
      bonus = amount * (300 / 100)
    }
    else if(num === 3){
      bonus = amount * (360 / 100)
    }

    //Update Deposit Bonus DataBase
    handlePPDunLockUpdate(user_id, bonus)
    // let sql = `INSERT INTO first_deposit SET ?`;
    // connection.query(sql, data, (err, result)=>{
    //     if(err){
    //         (err)
    //     }else{
    //       (result)
    //     }
    // })
})

const handleSuccessfulDeposit = (async(event)=>{
    let eyyn = await DepositRequest.find({merchant_order_id:event.merchant_order_id })
    let user_id = eyyn[0].user_id
    let order_amount = parseFloat(eyyn[0].amount)
    //Get total Number of successful deposti by this user
    const no_of_deposit_successful_before = await DepositRequest.find({user_id: user_id, status: 'success'})
      handleFirstDeposit(user_id, order_amount, no_of_deposit_successful_before.length)
      const currentDeposit = await DepositRequest.updateOne({user_id, merchant_order_id: event.merchant_order_id }, {
        status:event.status,
        contract: event.contract
      })
    let resnj = await USDTwallet.find({user_id})
    let prev_bal = parseFloat(resnj[0].balance)
  let result = await USDTwallet.updateOne({user_id}, {
      balance:prev_bal + order_amount
    })
    const order_id = currentDeposit.order_id;
    await updateDepositHistory(order_id, DepositRequest);
})

const handleFailedTransaction = (async(event)=>{
  try{
    let eyyn = await DepositRequest.find({merchant_order_id:event.merchant_order_id })
    let user_id = eyyn[0].user_id;
    let order_amount = parseFloat(eyyn[0].amount);
    await DepositRequest.updateMany({user_id, merchant_order_id: event.merchant_order_id }, {
      status:event.status,
      contract: event.contract
    })
    const currentDeposit = await DepositRequest.findOne({user_id, merchant_order_id: event.merchant_order_id })
    const order_id = currentDeposit.order_id;
    await updateDepositHistory(order_id, DepositRequest);
  }
  catch(err){
    console.log(err)
    updateDepositHistory(user_id, event.merchant_order_id, describtion);
  }
})


const initiateDeposit = async (req, res) => {
  try {
    const {user_id} = req.id
    const { data } = req.body;
    const transaction_type = "Wallet Fund";
    const timestamp = Math.floor(Date.now() / 1000);
    let tokenid;

    if(data.network === "ERC20"){
      tokenid = "264f4725-3cfd-4ff6-bc80-ff9d799d5fb2"
    }
    else if(data.network === "TRX20"){
      tokenid = "0912e09a-d8e2-41d7-a0bc-a25530892988"
    }
    else if(data.network === "BEP20"){
      tokenid = "92b15088-7973-4813-b0f3-1895588a5df7"
    }
    const merchant_order_id = Math.floor(Math.random()*100000) + 1000000;
    const currency = "USD";
    const paymentData = {
      remark: transaction_type,
      token_id : tokenid,
      product_price: data.amount.toString(),
      merchant_order_id:merchant_order_id.toString(),
      denominated_currency: currency,
      order_valid_period: 43200,
    };

    let str = CCPAYMENT_API_ID + CC_APP_SECRET +  timestamp + JSON.stringify(paymentData);
    let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
    const headers = {
      Appid: CCPAYMENT_API_ID,
      "Content-Type": "application/json; charset=utf-8",
      Timestamp: timestamp,
      Sign: sign,
    };
  await axios.post(`${CCPAYMENT_API_URL}/ccpayment/v1/bill/create`, paymentData,
      {  headers: headers } 
    ).then((response)=>{
      RequestTransaction({...response.data, user_id, merchant_order_id:merchant_order_id.toString()})
      res.status(200).json({status: true,message: response.data.msg, ...response.data, status: "pending"});
    })
    .catch((error)=>{
      console.error("Error processing deposit:", error);
      res.status(404).json({ status: false, message: "Internal server error" });
    })
  }
   catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const confirmDeposit = async () => {
  try {
    let usersID = []
    let deoop = await DepositRequest.find()
    if(deoop > 0){
      deoop.forEach(element => {
        if(element.status === "Pending"){
          usersID.push(element.merchant_order_id)
      }
      });
    }
  if(usersID.length > 0){
    setTimeout(async()=>{
      const timestamp = Math.floor(Date.now() / 1000);
      let str =  CCPAYMENT_API_ID + CC_APP_SECRET + timestamp +  JSON.stringify({"merchant_order_ids": usersID});
      let sign = crypto.createHash("sha256").update(str, "utf8").digest("hex");
      const headers = {
        Appid: CCPAYMENT_API_ID,
        "Content-Type": "application/json; charset=utf-8",
        Timestamp: timestamp,
        Sign: sign,
      };
      const response = await axios.post(
      `${CCPAYMENT_API_URL}/ccpayment/v1/bill/info`,{
        merchant_order_ids: usersID
      },
        {
          headers: headers,
        }
      );

      let result = response.data.data
      if(usersID.length > 0){
        result.forEach(element => {
          if(element.order_detail.status === "Successful"){
            handleSuccessfulDeposit(element.order_detail)
          }
           else if(element.order_detail.status !== "Pending"){
            handleFailedTransaction(element.order_detail)
          }
        });
      }
    },3000)
  }
  } catch (error) {
    console.error("Error confirming deposit:", error);
  }
}

setInterval(() => {
  // confirmDeposit()
}, 17000);


const fetchPendingOrder = (async(req, res)=>{
    const {user_id} = req.id
    try{
      const jdiok = await DepositRequest.find({user_id, status: "Pending"})
        res.status(200).json(jdiok)
    }
    catch(error){
      res.status(500).json(error)
    }
})


module.exports = { initiateDeposit, fetchPendingOrder }