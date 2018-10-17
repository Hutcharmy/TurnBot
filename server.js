require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const GameList = require('./gameList');
const games = new GameList();

app.get('/auth/redirect', (req, res) => {
  const options = {
    uri: 'https://slack.com/api/oauth.access?code=' 
       + req.query.code + '&client_id=' 
       + process.env.CLIENT_ID + '&client_secret=' 
       + process.env.CLIENT_SECRET+'&redirect_uri=http://cse252.spikeshroud.com:8000/auth/redirect',
    method: 'GET'
  };
  request(options, (error, response, body) => {
    const JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      console.log(JSONresponse);
      res.send('Error encountered: \n' + JSON.stringify(JSONresponse)).status(200).end();
    } else {
      console.log(JSONresponse);
      fs.appendFile('Authorizations.json', JSONresponse, (err) => {
        if (err) {console.log(err);}
        return;
      });
      res.send('Success!');
    }
  });
});
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
