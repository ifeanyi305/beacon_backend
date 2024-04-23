const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { initiateDeposit, fetchPendingOrder } = require("../controller/depositController");

// auth middleware
router.use(requireAuth);

router.post("/initiate", initiateDeposit);
router.get("/pending-order", fetchPendingOrder);
module.exports = router;
