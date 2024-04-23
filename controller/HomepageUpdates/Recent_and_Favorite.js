
const CrashGame = require("../../model/crashgame");
const DiceGame = require("../../model/dice_game");
const MineGame = require("../../model/minesgameInit");

const winningList = [];
  

const Get_games_played_in_last_1hr = async (gameModel, user_id) => {
    try {
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        const gamesPlayedLastOneHour = await gameModel.find({
            user_id: user_id,
            time: { $gte: oneHourAgo },
        });
        const gamesPlayed = gamesPlayedLastOneHour.length;
        winningList.push({ game_type: `${gameModel.modelName}`, game: gamesPlayedLastOneHour, numbersOfTimePlayed: gamesPlayed });
    } catch (error) {
        console.log(error);
    }
}

const Get_all_games_played_in_last_1hr = async (user_id) => {
    await Get_games_played_in_last_1hr(CrashGame, user_id);
    await Get_games_played_in_last_1hr(DiceGame, user_id);
    await Get_games_played_in_last_1hr(MineGame, user_id);
    return winningList;
}


const Recently_played = async (req, res) => {
    try {
        const Games_played_in_the_last_1hr = await Get_all_games_played_in_last_1hr("wNCUDCpyHXQ4hOcNu6smbaWlRAj2");
        const sortedList = Games_played_in_the_last_1hr.sort((a, b) => b.game.time - a.game.time);
        const topFour = sortedList.slice(0, 5);
        const filter = topFour.filter(game => game.game.length > 0)

        res.status(200).json({
            recent: filter,
        });
    } catch (error) {
        console.log(error);
    }
}

const Favorite_played_games = async (req, res) => {
    try {
        const Games_played_in_the_last_1hr = await Get_all_games_played_in_last_1hr("wNCUDCpyHXQ4hOcNu6smbaWlRAj2");
        const sortedList = Games_played_in_the_last_1hr.sort((a, b) => b.numbersOfTimePlayed - a.numbersOfTimePlayed);
        const topTwo = sortedList.slice(0, 2);
        const filter = topTwo.filter(game => game.game.length > 0)
        filter.forEach(game => {
            return {
                game_type: game.game.game_type,
                numbersOfTimePlayed: game.game.numbersOfTimePlayed
            }
        })

        res.status(200).json({
            favorite: filter,
        });
    } catch (error) {
        console.log(error);
    }
}


module.exports = { Recently_played, Favorite_played_games };