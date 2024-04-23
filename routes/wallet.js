const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  GetPPDWallet, GetPPFWallet, GetPPLWallet, GetUSDTWallet, GetDefaultWallet, UpdatedefaultWallet}  = require('../controller/walletControlers')

router.get('/ppd-wallet', GetPPDWallet)
router.get('/ppf-wallet', GetPPFWallet)
router.get('/ppl-wallet', GetPPLWallet)
router.get('/usdt-wallet', GetUSDTWallet)
router.get('/default-wallets', GetDefaultWallet)
router.post('/update-default-wallets', UpdatedefaultWallet)

module.exports = router