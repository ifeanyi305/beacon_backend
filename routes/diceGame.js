const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
// auth middleware
router.use(requireAuth);
const { handleDiceBet, getDiceGameHistory, seedSettings, handleDiceGameEncryption, HandlePlayDice } = require('../controller/diceControllers')

router.post('/bet', HandlePlayDice)
router.post('/seed-settings', seedSettings)
router.get('/encrypt', handleDiceGameEncryption)
router.get('/dice-history', getDiceGameHistory)

module.exports = router