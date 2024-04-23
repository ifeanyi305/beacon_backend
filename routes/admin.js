
const express = require('express')
const {
    createMember,
    getAllMembers,
    adminDashbaord,
    findUserById,
    findUserByUsername,
    registeredUserstats,
    totalWageredAndTotalWon,
    totalWageredRanking,
    totalWonRanking,
    totalLossRanking,
    dailyReport,
    gameReport,
    ggrReport,
    createFlashDrop,
    dailyReportByDate
} = require('../controller/adminController')
const { login, register, currentUser, findAdminById, findAdminByUsername, updateAdmin, updatePin, updatePassword, suspend, role, updateAvailability,removeAdmin, getAllAdmin, createChatSettings, updateChatSettings, getChatSettings, confirmPin } = require('../controller/adminAuthController')
const { protect } = require('../middleware/auth')

const router = express.Router()

/* ADMIN AUTH */
//POST
router.post('/auth/login', login)
router.post('/auth/pin', confirmPin)
router.post('/auth/register', protect, register)
//PATCH
router.patch('/auth/update', protect, updateAdmin)
router.patch('/auth/update', protect, updatePin)
router.patch('/auth/password', protect, updatePassword)
router.patch('/auth/suspend', protect, suspend)
router.patch('/auth/avalability', protect, updateAvailability)

//DELETE
router.delete('/remove/:id', protect, removeAdmin)

//GET
router.get('/user/current', protect, currentUser)
router.get('/listadmins/list', protect, getAllAdmin)
router.get('/user/:id', protect, findAdminById)
router.get('/adminuser/:username', protect, findAdminByUsername)




/* READ DASHBOARD AND REPORT */

/* Get Admin Dashboard */
router.get('/dashboard', adminDashbaord)
router.get('/userstats', registeredUserstats)
router.get('/wageredwonstats', totalWageredAndTotalWon)
router.get('/wageredranking', totalWageredRanking)
router.get('/wonranking', totalWonRanking)
router.get('/lossranking', totalLossRanking)
router.get('/members', protect, getAllMembers)
router.get('/member/:user_id', protect, findUserById)
router.get('/member/username/:username', protect, findUserByUsername)
router.get('/report', protect, dailyReport)
router.get('/dayreport',protect,  dailyReportByDate)
router.get('/gamereport', protect, gameReport)
router.get('/ggrreport', protect, ggrReport)



/* CREATE */

/* Create Member */
router.post('/create', protect, createMember)

//Chat Settings
router.post('/chatsettings', protect, createChatSettings)
router.patch('/chatsettings', protect, updateChatSettings)
router.get('/chatsettings', protect, getChatSettings)


//Create Flash Drop
router.post('/flashdrop', protect, createFlashDrop)


module.exports = router