const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const AllPLays = require("./routes/admin/PLayers/crashPlayers");
const Transaction = require("./routes/transactions.js");
const Stats = require("./routes/admin/statistic/statistics");
const Statistics = require("./routes/statistic.js");
const Affiliate = require("./routes/affiliate");
const CrashGame = require("./routes/crashgame.js");
const User = require("./routes/Users.js");
const Admin = require("./routes/admin.js");
const Promotion = require("./routes/promotion.js");
const Profile = require("./routes/Profile.js");
const Chat = require("./routes/chat");
require("./controller/lotteryEngine.js");
require("./controller/cronScheduler.js");
require("./controller/rainCronScheduller.js")
const minegame = require("./routes/mines");
const Wallet = require("./routes/wallet.js");
const diceGame = require("./routes/diceGame");
const Deposit = require("./routes/deposit");
const Withdraw = require("./routes/withdraw")
const Bonus = require('./routes/bonus');
const Lottery = require('./routes/lottery');
const HiloGame = require('./routes/hiloGame.js');
const TransactionHistory = require("./routes/transactionHistory.js");
const homePageUpdates = require("./routes/homePageUpdates");
const { createsocket } = require("./socket/index.js");
const { createServer } = require("node:http");
//Test

const { testCashback } = require("./profile_mangement/week_cashback")
const { testResetCashback } = require("./profile_mangement/rechargebonus")

require("dotenv").config();
// ============ Initilize the app ========================

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const server = createServer(app);
async function main() {
  createsocket(server);
}
main();

// application routes
app.use("/api/user/crash-game", CrashGame);
app.use("/api/user/dice-game", diceGame);
app.use("/api/user/mine-game", minegame);
app.use("/api/hilo-game", HiloGame);
app.use("/api/users", User);
app.use("/api/public-chat", Chat);
app.use("/api/profile", Profile);
app.use("/api/wallet", Wallet);
app.use("/api/affiliate", Affiliate);
app.use("/api/deposit", Deposit);
app.use("/api/withdraw", Withdraw);
app.use("/api/cashback", Bonus);
app.use("/api/stats", Stats);
app.use("/api/statistics", Statistics);
app.use("/api/transaction", Transaction);
app.use("/api/lottery", Lottery);
app.use("/api/transaction-history", TransactionHistory);
app.use("/admin/all-players", AllPLays);
app.use("/api/home-page-updates", homePageUpdates);
app.use('/api/promotion', Promotion);
//TODO: REMOVE
app.post("/api/test-cashback", testCashback);
//TODO: REMOVE
app.post("/api/deactivate-recharge", testResetCashback)


//admin routes
app.use('/admin', Admin);

app.get("/", (req, res) => {
  res.send("Welcome to Dotplayplay backend server");
})

mongoose.set('strictQuery', false);
const dbUri = `mongodb+srv://highscoreteh:eNiIQbm4ZMSor8VL@cluster0.xmpkpjc.mongodb.net/main_page?retryWrites=true&w=majority`

// const dbUri = `mongodb://localhost:27017/dpp`;
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Database connected'))
  .catch((err) => console.log(err))
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log("Running on port " + PORT)
})