import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header" >
          <h1 >TurnBot</h1>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <p>
            A slack app for tracking who's turn it is. For games, rotations, and anything else you need to take turns in!
          </p>
          <p>
            Click the link below to add Turnbot to your webpage!
          </p>
          <a 
          href="https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=146946755856.427760650839">
            <img alt="Add to Slack" height="40" width="139" 
            src="https://platform.slack-edge.com/img/add_to_slack.png" 
            srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
          </a>
        </header>
      </div>
    );
  }
}

export default App;
