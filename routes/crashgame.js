const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const { handleCrashBet, handleCashout ,handleCrashHistory,handleMybets, handleRedTrendball} = require('../controller/crashControllers')
router.post('/history', handleCrashHistory)
// auth middleware
router.use(requireAuth);
router.post('/bet', handleCrashBet)
router.get('/my-bet', handleMybets)
router.post('/cashout', handleCashout)
router.post('/red-trendball', handleRedTrendball)
router.get("/crash-history", handleCrashHistory);

module.exports = router