const express = require('express')
const router = express.Router()

const {  handleDeposit }  = require('../payments/index')
router.post('/ccpayment-api', handleDeposit )

module.exports = router