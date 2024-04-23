const express = require('express');
const { spin, rollcompetition, is_spin, getUserSpinTransaction, getAllSpin } = require('../controller/promotion');
const { protect } = require('../middleware/auth')
const router = express.Router()

router.get('/is_spin', protect, is_spin)

router.post('/spin', protect, spin)

router.get('/trx', protect, getUserSpinTransaction)

router.get('/all', protect, getAllSpin)

router.get('/roll-competition', protect, rollcompetition )

module.exports = router