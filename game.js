const fs = require('fs');
class Game {
  constructor() {
    const data = JSON.parse(fs.readFileSync('prevGame.json'));
    if (data.name) {
      this.name = data.name;
    }
    if (data.players && data.players.length > 0) {
      this.players = data.players;
      if (data.currentPlayer) {
        this.currentPlayer = data.currentPlayer;
      } else {
        this.currentPlayer = 0;
      }
    }

    
  }
  setName(name) {
    this.name= name;
    this.currentPlayer = 0;
    this.players = [];
    fs.writeFile('prevGame.json', JSON.stringify(this), (err) =>{
      if (err) throw err;
    });
  }
  setTurnOrder(players) {
    this.players = [];
    for (var player of players) {
      this.players.push(player);
    }
    this.currentPlayer = 0;
    fs.writeFile('prevGame.json', JSON.stringify(this), (err) =>{
      if (err) throw err;
    });
  }
  endTurn(){
    this.currentPlayer++;
    if (this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    fs.writeFile('prevGame.json', JSON.stringify(this), (err) =>{
      if (err) throw err;
    });
    return this.players[this.currentPlayer];
  }
  getCurrentUser(){
    return this.players[this.currentPlayer];
  }
}

module.exports = Game;