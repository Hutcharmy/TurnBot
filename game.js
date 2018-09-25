const fs = require('fs');
class Game {
  constructor(name = null, channelId = null, teamId = null, players = null, currentPlayer = null) {
    if (name) {
      this.name = name;
    }
    if(teamId){
      this.teamId = teamId;
    }
    else {
      throw new Error('Team ID not found');
    }
    if(channelId){
      this.channelId = channelId;
    }
    else {
      throw new Error('Channel ID not found');
    }
    if (players && players.length > 0) {
      this.players = players;
      if (currentPlayer) {
        this.currentPlayer = currentPlayer;
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
      if(player && player.trim() != ''){
        this.players.push(player);
      }
    }
    this.currentPlayer = 0;
    fs.writeFile('prevGame.json', JSON.stringify(this), (err) =>{
      if (err) throw err;
    });
  }
  getChannelAndTeam() {
    return {
      channelId: this.channelId, 
      teamId: this.teamId
    };
  }
  endTurn(){
    this.currentPlayer++;
    if (this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    return this.players[this.currentPlayer];
  }
  pass() {
    this.players.splice(this.currentPlayer, 1);
    if (this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    return this.players[this.currentPlayer];
  }
  getCurrentUser(){
    return this.players[this.currentPlayer];
  }
}

module.exports = Game;
