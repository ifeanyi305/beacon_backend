const CrashGame = require("../../model/crashgame");
const DiceGame = require("../../model/dice_game");
const MineGame = require("../../model/minesgameInit");

const winningList = [];

const Get_games_won_last_24hrs = async (gameModel) => {
    try{
        const currentTime = new Date();
        const twentyFourHoursAgo = currentTime.setHours(currentTime.getHours() - 24);
        const gamesWonLast24Hours = await gameModel.find({
            has_won: true,
            timestamp: { $gte: twentyFourHoursAgo },
        })
        const numberWon = gamesWonLast24Hours.length;
        winningList.push({gameName: `${gameModel.modelName}`, numberWon: numberWon});
    }catch(error){
        console.log(error);
    }
}

const Get_most_won_games_in_last_24hrs = async () => {
    await Get_games_won_last_24hrs(CrashGame);
    await Get_games_won_last_24hrs(DiceGame);
    await Get_games_won_last_24hrs(MineGame);
    return winningList;
}

const Winning_games = async (req, res) => {
    try {
        const Games_won_in_the_last_24hours = await Get_most_won_games_in_last_24hrs();
        const sortedList = Games_won_in_the_last_24hours.sort((a, b) => b.numberWon - a.numberWon);
        const topFour = sortedList.slice(0, 5);

        res.status(200).json({
            data: topFour,
        });
    }catch(error){
        console.log(error);
    }
}

module.exports = {Winning_games}