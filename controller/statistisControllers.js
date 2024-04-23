// const CrashGame = require("../model/crashgame")
// const DiceGame = require("../model/dice_game")

// const globalStat = (async( req, res )=>{
//     const {user_id} = req.body
//     let global_statistics = []
//     try{
//     let response = await CrashGame.updateOne({user_id})
//     response.forEach(element => {
//         global_statistics.push(element)
//     })

//     let dice_res = await DiceGame.updateOne({user_id})
//     dice_res.forEach(element => {
//         global_statistics.push(element)
//     })
//     let PPF = []
//     let PPF_lose = []
//     let PPF_win = []
//     let PPF_img = ''
//     let PPF_wagered = 0

//     let PPD = []
//     let PPD_lose = []
//     let PPD_win = []
//     let PPD_img = ''
//     let PPD_wagered = 0

//     let PPL = []
//     let PPL_lose = []
//     let PPL_win = []
//     let PPL_img = ''
//     let PPL_wagered = 0

//     let USDT = []
//     let USDT_lose = []
//     let USDT_win = []
//     let USDT_img = ''
//     let USDT_wagered = 0

//         setTimeout(()=>{
//             for (let index = 0; index < global_statistics.length; index++) {
//                 const element = global_statistics[index];
//                 if(element.token === "USDT"){
//                     USDT.push(element)
//                     USDT_img = element.token_img
//                     USDT_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         USDT_lose.push(element)
//                     }else{
//                         USDT_win.push(element) 
//                     }
//                 }

//                 else if(element.token === "PPF"){
//                     PPF.push(element)
//                     PPF_img = element.token_img
//                     PPF_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         PPF_lose.push(element)
//                     }else{
//                         PPF_win.push(element) 
//                     }
//                 }

//                 else if(element.token === "PPD"){
//                     PPD.push(element)
//                     PPD_img = element.token_img
//                     PPD_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         PPD_lose.push(element)
//                     }else{
//                         PPD_win.push(element) 
//                     }
//                 }

//                 else if(element.token === "PPL"){
//                     PPL.push(element)
//                     PPL_img = element.token_img
//                     PPL_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         PPL_lose.push(element)
//                     }else{
//                         PPL_win.push(element) 
//                     }
//                 }
//             }

//             let total_wagered = USDT_wagered + PPD_wagered
//             let total_lose = PPF_lose.length + PPD_lose.length + PPL_lose.length + USDT_lose.length 
//             let total_win = PPF_win.length + PPD_win.length + PPL_win.length + USDT_win.length 
//             let total_bet = global_statistics.length
//             let ppf = {ppf_bets:PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered:PPF_wagered, ppf_img:PPF_img }
//             let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
//             let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
//             let usdt = {usdt_bets:USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered:USDT_wagered, usdt_img:USDT_img }

//         res.status(200).json({total_wagered, total_bet,total_lose,total_win, ppf, ppd, ppl, usdt})
//         },500)
//     }
//     catch(error){
//         res.status(500).json({error})
//         console.log(error)
//     }
// })



// const CrashGameStat = (async( req, res )=>{
//     const {user_id} = req.body
//     let global_statistics = []

//     try{
//         let response = await CrashGame.updateOne({user_id})
//         response.forEach(element => {
//             global_statistics.push(element)
//         })


//         let PPF = []
//         let PPF_lose = []
//         let PPF_win = []
//         let PPF_img = ''
//         let PPF_wagered = 0

//         let PPD = []
//         let PPD_lose = []
//         let PPD_win = []
//         let PPD_img = ''
//         let PPD_wagered = 0

//         let PPL = []
//         let PPL_lose = []
//         let PPL_win = []
//         let PPL_img = ''
//         let PPL_wagered = 0

//         let USDT = []
//         let USDT_lose = []
//         let USDT_win = []
//         let USDT_img = ''
//         let USDT_wagered = 0

//         setTimeout(()=>{
//             for (let index = 0; index < global_statistics.length; index++) {
//                 const element = global_statistics[index];
//                 if(element.token === "USDT"){
//                     USDT.push(element)
//                     USDT_img = element.token_img
//                     USDT_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         USDT_lose.push(element)
//                     }else{
//                         USDT_win.push(element) 
//                     }
//                 }

//                 else if(element.token === "PPF"){
//                     PPF.push(element)
//                     PPF_img = element.token_img
//                     PPF_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         PPF_lose.push(element)
//                     }else{
//                         PPF_win.push(element) 
//                     }
//                 }

//                 else if(element.token === "PPD"){
//                     PPD.push(element)
//                     PPD_img = element.token_img
//                     PPD_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         PPD_lose.push(element)
//                     }else{
//                         PPD_win.push(element) 
//                     }
//                 }
//                 else if(element.token === "PPL"){
//                     PPL.push(element)
//                     PPL_img = element.token_img
//                     PPL_wagered += (parseInt(element.bet_amount))
//                     if(!element.has_won){
//                         PPL_lose.push(element)
//                     }else{
//                         PPL_win.push(element) 
//                     }
//                 }
//             }

//             let total_wagered = USDT_wagered + PPD_wagered
//             let total_lose = PPF_lose.length + PPD_lose.length  + PPL_lose.length + USDT_lose.length 
//             let total_win = PPF_win.length + PPD_win.length + PPL_win.length + USDT_win.length 
//             let total_bet = global_statistics.length
//             let ppf = {ppf_bets:PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered:PPF_wagered, ppf_img:PPF_img }
//             let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
//             let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
//             let usdt = {usdt_bets:USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered:USDT_wagered, usdt_img:USDT_img }

//             res.status(200).json({total_wagered, total_bet,total_lose,total_win, ppf, ppd, ppl, usdt})
//         },500)
//     }

//     catch(error){
//         res.status(500).json({error})
//     }
// })



// const DiceGameStat = ( async( req, res )=>{
//     const {user_id} = req.body
//     let global_statistics = []
//     try{

//         let dice_res = await DiceGame.updateOne({user_id})
//         dice_res.forEach(element => {
//             global_statistics.push(element)
//         })
//         let PPF = []
//         let PPF_lose = []
//         let PPF_win = []
//         let PPF_img = ''
//         let PPF_wagered = 0

//         let PPD = []
//         let PPD_lose = []
//         let PPD_win = []
//         let PPD_img = ''
//         let PPD_wagered = 0

//         let PPL = []
//         let PPL_lose = []
//         let PPL_win = []
//         let PPL_img = ''
//         let PPL_wagered = 0

//         let USDT = []
//         let USDT_lose = []
//         let USDT_win = []
//         let USDT_img = ''
//         let USDT_wagered = 0

//         setTimeout(()=>{
//             for (let index = 0; index < global_statistics.length; index++) {
//                 const element = global_statistics[index];
//                 if(element.token === "USDT"){
//                     USDT.push(element)
//                     USDT_img = element.token_img
//                     USDT_wagered += (parseInt(element.bet_amount))
//                     if(element.win_lose !== "win"){
//                         USDT_lose.push(element)
//                     }else{
//                         USDT_win.push(element) 
//                     }
//                 }
//                 else if(element.token === "PPF"){
//                     PPF.push(element)
//                     PPF_img = element.token_img
//                     PPF_wagered += (parseInt(element.bet_amount))
//                     if(element.win_lose !== "win"){
//                         PPF_lose.push(element)
//                     }else{
//                         PPF_win.push(element) 
//                     }
//                 }
//                 else if(element.token === "PPD"){
//                     PPD.push(element)
//                     PPD_img = element.token_img
//                     PPD_wagered += (parseInt(element.bet_amount))
//                     if(element.win_lose !== "win"){
//                         PPD_lose.push(element)
//                     }else{
//                         PPD_win.push(element) 
//                     }
//                 }
//                 else if(element.token === "PPL"){
//                     PPL.push(element)
//                     PPL_img = element.token_img
//                     PPL_wagered += (parseInt(element.bet_amount))
//                     if(element.win_lose !== "win"){
//                         PPL_lose.push(element)
//                     }else{
//                         PPL_win.push(element) 
//                     }
//                 }
//             }

//             let total_wagered = USDT_wagered + PPD_wagered
//             let total_lose = PPF_lose.length + PPD_lose.length + PPL_lose.length + USDT_lose.length 
//             let total_win = PPF_win.length + PPD_win.length + PPL_win.length + USDT_win.length 
//             let total_bet = global_statistics.length
//             let ppf = {ppf_bets:PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered:PPF_wagered, ppf_img:PPF_img }
//             let ppd = {ppd_bets:PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered:PPD_wagered, ppd_img:PPD_img }
//             let ppl = {ppl_bets:PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered:PPL_wagered, ppl_img:PPL_img }
//             let usdt = {usdt_bets:USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered:USDT_wagered, usdt_img:USDT_img }

//             res.status(200).json({total_wagered, total_bet,total_lose,total_win, ppf, ppd, ppl, usdt})
//         },500)
//     }

//     catch(error){
//         res.status(500).json({error})
//     }
// })


// module.exports = { globalStat, CrashGameStat , DiceGameStat}

const CrashGame = require("../model/crashgame")
const DiceGame = require("../model/dice_game")
const MinesGame = require("../model/minesgameInit")

const GlobalStat = (async (req, res) => {
    const { user_id } = req.body
    let global_statistics = []
    try {
        let response = await CrashGame.find({ user_id })
        response.forEach(element => {
            global_statistics.push(element)
        })

        let dice_res = await DiceGame.find({ user_id })
        dice_res.forEach(element => {
            global_statistics.push(element)
        })

        let PPF = []
        let PPF_lose = []
        let PPF_win = []
        let PPF_img = ''
        let PPF_wagered = 0

        let USDT = []
        let USDT_lose = []
        let USDT_win = []
        let USDT_img = ''
        let USDT_wagered = 0


        global_statistics.forEach(element => {
            if (element.token === "USDT") {
                USDT.push(element)
                USDT_img = element.token_img
                USDT_wagered += (parseInt(element.bet_amount))
                if (element.has_won) {
                    USDT_win.push(element)
                } else {
                    USDT_lose.push(element)
                }
            }
            else if (element.token === "PPF") {
                PPF.push(element)
                PPF_img = element.token_img
                PPF_wagered += (parseInt(element.bet_amount))
                if (element.has_won) {
                    PPF_win.push(element)
                } else {
                    PPF_lose.push(element)
                }
            }
        })

        let total_wagered = USDT_wagered
        let total_lose = PPF_lose.length + USDT_lose.length
        let total_win = PPF_win.length + USDT_win.length
        let total_bet = global_statistics.length
        let ppf = { ppf_bets: PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered: PPF_wagered, ppf_img: PPF_img }
        let usdt = { usdt_bets: USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered: USDT_wagered, usdt_img: USDT_img }

        res.status(200).json({ total_wagered, total_bet, total_lose, total_win, ppf, usdt })
    }
    catch (error) {
        res.status(500).json({ error })
    }
})


const gameStats = (async (req, res) => {
    const { user_id, game } = req.body
    let global_statistics = []
    try {
        if (game === 'crash') {
            let response = await CrashGame.find({ user_id })
            response.forEach(element => {
                global_statistics.push(element)
            })
        } else if (game === 'dice') {
            let response = await DiceGame.find({ user_id })
            response.forEach(element => {
                global_statistics.push(element)
            })
        } else if (game === 'mines') {
            let response = await MinesGame.find({ user_id })
            response.forEach(element => {
                global_statistics.push(element)
            })
        }


        let PPF = []
        let PPF_lose = []
        let PPF_win = []
        let PPF_img = ''
        let PPF_wagered = 0

        let PPD = []
        let PPD_lose = []
        let PPD_win = []
        let PPD_img = ''
        let PPD_wagered = 0

        let PPE = []
        let PPE_lose = []
        let PPE_win = []
        let PPE_img = ''
        let PPE_wagered = 0

        let PPL = []
        let PPL_lose = []
        let PPL_win = []
        let PPL_img = ''
        let PPL_wagered = 0

        let USDT = []
        let USDT_lose = []
        let USDT_win = []
        let USDT_img = ''
        let USDT_wagered = 0

        setTimeout(() => {
            for (let index = 0; index < global_statistics.length; index++) {
                const element = global_statistics[index];
                if (element.token === "USDT") {
                    USDT.push(element)
                    USDT_img = element.token_img
                    USDT_wagered += (parseInt(element.bet_amount))
                    if (element.has_won) {
                        USDT_lose.push(element)
                    } else {
                        USDT_win.push(element)
                    }
                }
                else if (element.token === "PPF") {
                    PPF.push(element)
                    PPF_img = element.token_img
                    PPF_wagered += (parseInt(element.bet_amount))
                    if (element.has_won) {
                        PPF_lose.push(element)
                    } else {
                        PPF_win.push(element)
                    }
                }
                else if (element.token === "PPD") {
                    PPD.push(element)
                    PPD_img = element.token_img
                    PPD_wagered += (parseInt(element.bet_amount))
                    if (element.has_won) {
                        PPD_lose.push(element)
                    } else {
                        PPD_win.push(element)
                    }
                }
                else if (element.token === "PPE") {
                    PPE.push(element)
                    PPE_img = element.token_img
                    PPE_wagered += (parseInt(element.bet_amount))
                    if (element.has_won) {
                        PPE_lose.push(element)
                    } else {
                        PPE_win.push(element)
                    }
                }
                else if (element.token === "PPL") {
                    PPL.push(element)
                    PPL_img = element.token_img
                    PPL_wagered += (parseInt(element.bet_amount))
                    if (element.has_won) {
                        PPL_lose.push(element)
                    } else {
                        PPL_win.push(element)
                    }
                }
            }

            let total_wagered = USDT_wagered + PPD_wagered
            let total_lose = PPF_lose.length + PPD_lose.length + PPE_lose.length + PPL_lose.length + USDT_lose.length
            let total_win = PPF_win.length + PPD_win.length + PPE_win.length + PPL_win.length + USDT_win.length
            let total_bet = global_statistics.length
            let ppf = { ppf_bets: PPF.length, ppf_win: PPF_win.length, ppf_lose: PPF_lose.length, ppf_wagered: PPF_wagered, ppf_img: PPF_img }
            let ppd = { ppd_bets: PPD.length, ppd_win: PPD_win.length, ppd_lose: PPD_lose.length, ppd_wagered: PPD_wagered, ppd_img: PPD_img }
            let ppe = { ppe_bets: PPE.length, ppe_win: PPE_win.length, ppe_lose: PPE_lose.length, ppe_wagered: PPE_wagered, ppe_img: PPE_img }
            let ppl = { ppl_bets: PPL.length, ppl_win: PPL_win.length, ppl_lose: PPL_lose.length, ppl_wagered: PPL_wagered, ppl_img: PPL_img }
            let usdt = { usdt_bets: USDT.length, usdt_win: USDT_win.length, usdt_lose: USDT_lose.length, usdt_wagered: USDT_wagered, usdt_img: USDT_img }

            res.status(200).json({ total_wagered, total_bet, total_lose, total_win, ppf, ppd, ppe, ppl, usdt })
        }, 500)
    }
    catch (error) {
        res.status(500).json({ error })
    }
})



module.exports = { GlobalStat, gameStats }