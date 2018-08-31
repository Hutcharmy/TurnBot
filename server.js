const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const Game = require('./game');
const game = new Game();

// const webhook = 'https://hooks.slack.com/services/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';
// app.get('/', (req, res) =>{
//   axios.post(webhook, {
//     text: 'Hello World'
//   });
//   res.status(200).send();
// });
app.post('/newgame', (req, res)=>{
  console.log('Recieved request for new game with text: ' + req.body.text);
  game.setName(req.body.text);
  res.status(200).json({
    response_type: 'in_channel',
    text:'Game created with name ' + game.name
  });
});
app.post('/setorder', (req, res) =>{
  console.log('POST /setorder');
  const re = /[^" ]+|("[^"]*")/g;
  const raw_players = req.body.text.match(re);
  const players = raw_players.map((player) =>{
    return player.replace('"', '').replace('"', '');
  });
  game.setTurnOrder(players);
  res.status(200).json({
    response_type: 'in_channel',
    text: 'Turn order set. It is ' + players[0] + '\'s turn!'
  });
});
app.post('/endturn', (req, res) =>{
  console.log('POST /endturn');
  const sender = req.body.user_id;
  const currentPlayer = game.getCurrentUser();
  const playerAt = currentPlayer.substring(currentPlayer.indexOf('@')+1, currentPlayer.indexOf('|'));
  let nextPlayer;
  if (sender == playerAt){
    nextPlayer = game.endTurn();
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
});
app.post('/whoisup', (req, res) =>{
  console.log('POST /whoisup');
  res.status(200).json({
    response_type: 'in_channel',
    text:'It is ' + game.getCurrentUser()+'\'s turn'
  });
});

app.listen(8000, () => console.log('Express server listening on port 8000 with game ' + game.name));