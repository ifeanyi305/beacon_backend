const { axios } = require("axios");
const USDTwallet = require("../model/Usdt-wallet")
const crypto = require("crypto");
const { updateWithdrawalHistory } = require("./transactionHistories/updateWithdrawalHistory");

const CCPAYMENT_API_ID = "202310051818371709996528511463424";
const CC_APP_SECRET = "206aed2f03af1b70305fb11319f2f57b";
const CCPAYMENT_API_URL = "https://admin.ccpayment.com";

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

const formattedDbTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

const initiateWithdrawal = async (req, res) => {
  try {
    const {user_id} = req.id
    const { data } = req.body;
    if (!data.address || !data.amount) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    if (data.amount < 6.4) {
      return res.status(400).json({
        status: false,
        message: "Amount must be greater than 6.4usdt",
      });

    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const formattedTimeStamp = currentTimestamp.toString().slice(0, 10);
    const snjws = await USDTwallet.find({user_id})
    const userBalance = snjws[0].balance;
      if (userBalance < data.amount) {
        return res.status(400).json({
          status: false,
          message: "Insufficient funds",
        });
      } else {
        
        let token_id;
        if(data.network === "ERC20"){
          token_id = "264f4725-3cfd-4ff6-bc80-ff9d799d5fb2"
        }
        else if(data.network === "TRX20"){
          token_id = "0912e09a-d8e2-41d7-a0bc-a25530892988"
        }
        else if(data.network === "BEP20"){
          token_id = "92b15088-7973-4813-b0f3-1895588a5df7"
        }

        const uniqueId = Math.floor(Math.random() * 1000);
        const transaction_id = parseInt(`${currentTimestamp}${uniqueId}`);
        const transaction_type = "Wallet Withdrawal";
        const merchant_order_id = transaction_id.toString();
        const memo = (Math.floor(Math.random() * 1000) * 9999).toString();

        const withdrawData = {
          merchant_order_id,
          merchant_pays_fee: false,
          address: data.address,
          token_id,
          value: (data.amount).toString(),
          memo,
        };
        let str =
          CCPAYMENT_API_ID +
          CC_APP_SECRET +
          formattedTimeStamp +
          JSON.stringify(withdrawData);
        let sign = crypto
          .createHash("sha256")
          .update(str, "utf8")
          .digest("hex");

        const headers = {
          Appid: CCPAYMENT_API_ID,
          "Content-Type": "application/json; charset=utf-8",
          Timestamp: formattedTimeStamp,
          Sign: sign,
        };
        const response = await axios.post(
          `${CCPAYMENT_API_URL}/ccpayment/v1/withdraw`,
          withdrawData,
          {
            headers: headers,
          });

        if (response.data.msg === "success") {
              const newAmount = Number(userBalance) - Number(data.amount);
              await USDTwallet.updateOne({user_id},{
                balance: newAmount
              });
              
              res.status(201).json({
                status: true,
                message: "Crypto withdrawn successfully",
                data: response.data,
              });
              await updateWithdrawalHistory(user_id, "Successful", data.amount, userBalance, newAmount);

        } else {
          res.status(400).json({
            status: false,
            message: `${response.data.msg}`,
          });
          console.log(response.data)
          await updateWithdrawalHistory(user_id, "Failed", data.amount);
        }
      }
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    // updateWithdrawalHistory(user_id, describtion, data.amount, userBalance, newAmount, "Failed");
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  initiateWithdrawal,
};
