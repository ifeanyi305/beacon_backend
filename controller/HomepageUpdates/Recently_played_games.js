
const CrashGame = require("../../model/crashgame");
const DiceGame = require("../../model/dice_game");
const MineGame = require("../../model/minesgameInit");

const winningList = [];

const Get_games_played_in_last_1hr = async (gameModel) => {
    try{
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        
        const gamesPlayedLastOneHour = await gameModel.find({
            timestamp: { $gte: oneHourAgo },
        });
        const gamesPlayed = gamesPlayedLastOneHour.length;
        winningList.push({gameName: `${gameModel.modelName}`, gamesPlayed: gamesPlayed});
    }catch(error){
        console.log(error);
    }
}

const Get_all_games_played_in_last_1hr = async () => {
    await Get_games_played_in_last_1hr(CrashGame);
    await Get_games_played_in_last_1hr(DiceGame);
    await Get_games_played_in_last_1hr(MineGame);
    return winningList;
}


const Recently_played_games = async (req, res) => {
    try {
        const Games_played_in_the_last_1hr = await Get_all_games_played_in_last_1hr();
        const sortedList = Games_played_in_the_last_1hr.sort((a, b) => b.numberWon - a.numberWon);
        const topFour = sortedList.slice(0, 5);

        res.status(200).json({
            data: topFour,
        });
    }catch(error){
        console.log(error);
    }
}

module.exports = {Recently_played_games};