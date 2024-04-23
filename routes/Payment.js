const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// auth middleware
// router.use(requireAuth);
const {
  initializeDeposit,
  confirmDeposit,
  initializeWithdrawal,
} = require("../controller/paymentController");
const { initiateWithdrawal } = require("../controller/withdrawController");

router.post("/withdraw/usdt", initiateWithdrawal);
router.post("/deposit", initializeDeposit);
router.post("/deposit-confirm", confirmDeposit);
router.post("/withdraw", initializeWithdrawal);
module.exports = router;
