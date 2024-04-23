const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth);
const {  handleSwap , handleBills}  = require('../controller/transactionControllers')
router.post('/swap', handleSwap)
router.get('/bill', handleBills)

module.exports = router

