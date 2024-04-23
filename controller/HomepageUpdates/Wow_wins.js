const CrashGame = require("../../model/crashgame");
const DiceGame = require("../../model/dice_game");
const MineGame = require("../../model/minesgameInit");

const Get_top_wins_in_a_game = async (gameModel) => {
    try {
      //NOTE: There should be atleast eight games that have been before.
      const topEightWins = await gameModel.find().sort({ payout: -1 }).limit(8); 
      return topEightWins;
    } catch (error) {
      console.error( { Note: "There should be atleast eight games that have been played" , error: error});
    }
  }

const Get_top_wins_from_all_games = async () => {
    const crashGameTopEightWins = await Get_top_wins_in_a_game(CrashGame);
    const diceGameTopEightWins = await Get_top_wins_in_a_game(DiceGame);
    const minesGameTopEightWins = await Get_top_wins_in_a_game(MineGame);
    const fullList = crashGameTopEightWins.concat(diceGameTopEightWins).concat(minesGameTopEightWins);
    const sortedList = fullList.sort((a, b) => b.payout - a.payout );
    const topEight = sortedList.slice(0, 9);
    return topEight;
}

const Wow_wins = async (req, res) => {
    try {
        const eightBiggestWins = await Get_top_wins_from_all_games();
        res.status(200).json({
        data: eightBiggestWins,
      });
    }catch(error){
        console.log(error);
    }
}

module.exports = {Wow_wins};