const fs = require('fs');
const Game = require('./game');
class GameList {
  constructor() {
    fs.readFile('./prevGame.json', 'utf8', (err, data) => {
      if(data){
        this.gameList = [];
        const gameList = JSON.parse(data);
        for(let game of gameList.gameList) {
          this.gameList.push(new Game(game.name, game.channelId, game.teamId, game.players, game.currentPlayer));
        }
      }
    });
  }
  getGameByIds(channelId, teamId) {
    return this.gameList.find((game) =>{
      const gameIds = game.getChannelAndTeam();
      return gameIds.channelId == channelId && gameIds.teamId == teamId;
    });
  }
  addNewGame(name, channelId, teamId) {
    const sameGame = this.gameList.find((game)=>{
      var ids = game.getChannelAndTeam();
      return ids.channelId == channelId && ids.teamId == teamId;
    });
    if(sameGame) {
      sameGame.setName(name);
    } else {
      this.gameList.push(new Game(name, channelId, teamId));
    }
    this.writeGames();
    return this.gameList[this.gameList.length - 1];
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