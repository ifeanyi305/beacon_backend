const CrashGame = require("../../model/crashgame");
const DiceGame = require("../../model/dice_game");
const MineGame = require("../../model/minesgameInit");

const winningList = [];

const Get_games_played_in_last_24hrs = async (gameModel) => {
    try{
        const currentTime = new Date();
        const twentyFourHoursAgo = currentTime.setHours(currentTime.getHours() - 24);
        const gamesPlayedLast24Hours = await gameModel.find({
            timestamp: { $gte: twentyFourHoursAgo },
        })
        const gamesPlayed = gamesPlayedLast24Hours.length;
        winningList.push({gameName: `${gameModel.modelName}`, gamesPlayed: gamesPlayed});
    }catch(error){
        console.log(error);
    }
}

const Get_all_games_played_in_last_24hrs = async () => {
    await Get_games_played_in_last_24hrs(CrashGame);
    await Get_games_played_in_last_24hrs(DiceGame);
    await Get_games_played_in_last_24hrs(MineGame);
    return winningList;
}


const Trending_games = async (req, res) => {
    try {
        const Games_played_in_the_last_24hours = await Get_all_games_played_in_last_24hrs();
        const sortedList = Games_played_in_the_last_24hours.sort((a, b) => b.numberWon - a.numberWon);
        const topFour = sortedList.slice(0, 5);

        res.status(200).json({
            data: topFour,
        });
    }catch(error){
        console.log(error);
    }
}

module.exports = {Trending_games};