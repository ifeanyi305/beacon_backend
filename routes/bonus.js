const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)

const { handleAllCashbacks } = require('../profile_mangement/cashbacks')
const { displayUnlockDDP } = require('../profile_mangement/ppd_unlock')

router.get("/", handleAllCashbacks)
router.get("/displayUnlockDDP", displayUnlockDDP)

module.exports = router