const fs = require('fs');
const Game = require('game');
class GameList {
  constructor() {
    const data = fs.readFileSync('prevGame.json');
    if(data){
      const gameList = JSON.stringify(data);
      for(let game of gameList) {
        this.gameList.push(new Game(game.name, game.channelId, game.teamId, game.players, game.currentPlayer));
      }
    }
  }
  getGameByIds(channelId, teamId) {
    return this.gameList.find((game) =>{
      const gameIds = game.getChannelAndTeam();
      return gameIds.channelId == channelId && gameIds.teamId == teamId;
    });
  }
  addNewGame(name, channelId, teamId, players) {
    this.gameList.push(new Game(name, channelId, teamId, players));
    this.writeGames();
    return this.gamesList[this.gamesList.length - 1];
  }
  writeGames() {
    fs.writeFile('prevGame.json', JSON.stringify(this), (err) =>{
      if (err) throw err;
    });
  }
  removeGame(channelId, teamId) {
    const game = this.gameList.findIndex((game) =>{
      const gameIds = game.getChannelAndTeam();
      return gameIds.channelId == channelId && gameIds.teamId == teamId;
    });
    this.gameList = this.gameList.slice(0, game) + this.gameList.slice(game + 1);
    this.writeGames();
  }
}

module.exports = GameList;