const express = require('express');
//const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const GameList = require('./gameList');
const games = new GameList();

// const webhook = 'https://hooks.slack.com/services/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';
// app.get('/', (req, res) =>{
//   axios.post(webhook, {
//     text: 'Hello World'
//   });
//   res.status(200).send();
// });
app.post('/newgame', (req, res)=>{
  console.log('Recieved request for new game with text: ' + req.body.text);
  const newGame = games.addNewGame(req.body.text, req.body.channel_id, req.body.team_id);
  res.status(200).json({
    response_type: 'in_channel',
    text:'Game created with name ' + newGame.name
  });
});
app.post('/setorder', (req, res) =>{
  console.log('POST /setorder');
  const re = /[^" ]+|("[^"]*")/g;
  const raw_players = req.body.text.match(re);
  const players = raw_players.map((player) =>{
    return player.replace('"', '').replace('"', '');
  });
  const game = games.getGameByIds(req.body.channel_id, req.body.team_id);
  if (game){
    game.setTurnOrder(players);
    games.writeGames();
    res.status(200).json({
      response_type: 'in_channel',
      text: 'Turn order set. It is ' + players[0] + '\'s turn!'
    });
  }
  else {
    res.status(400).send('No game found for current channel.');
  }
  
});
app.post('/endturn', (req, res) =>{
  console.log('POST /endturn');
  const sender = req.body.user_id;
  const game = games.getGameByIds(req.body.channel_id, req.body.team_id);
  if (game){
    const currentPlayer = game.getCurrentUser();
    const playerAt = currentPlayer.substring(currentPlayer.indexOf('@')+1, currentPlayer.indexOf('|'));
    let nextPlayer;
    if (sender == playerAt){
      nextPlayer = game.endTurn();
      games.writeGames();
      res.status(200).json({
        response_type: 'in_channel',
        text:nextPlayer + ' is up!'
      });
    }
    else {
      res.status(200).json({
        response_type: 'in_channel',
        text:'You cannot end another player\'s turn. ' + currentPlayer + 'must end their turn'
      });
    }
  }
  else {
    res.status(400).send('No game found for current channel.');
  }
});
app.post('/pass', (req, res) =>{
  console.log('POST /pass');
  const sender = req.body.user_id;
  const game = games.getGameByIds(req.body.channel_id, req.body.team_id);
  if (game){
    const currentPlayer = game.getCurrentUser();
    const playerAt = currentPlayer.substring(currentPlayer.indexOf('@')+1, currentPlayer.indexOf('|'));
    let nextPlayer;
    if (sender == playerAt){
      nextPlayer = game.pass();
      games.writeGames();
      res.status(200).json({
        response_type: 'in_channel',
        text:nextPlayer + ' is up!'
      });
    }
    else {
      res.status(200).json({
        response_type: 'in_channel',
        text:'You cannot end another player\'s turn. ' + currentPlayer + 'must end their turn'
      });
    }
  }
  else {
    res.status(400).send('No game found for current channel.');
  }
});
app.post('/whoisup', (req, res) =>{
  console.log('POST /whoisup');
  const game = games.getGameByIds(req.body.channel_id, req.body.team_id);
  if (game){
    res.status(200).json({
      response_type: 'in_channel',
      text:'It is ' + game.getCurrentUser()+'\'s turn'
    });
  
  }
  else {
    res.status(400).send('No game found for current channel.');
  }
});

app.listen(8000, () => console.log('Express server listening on port 8000'));
