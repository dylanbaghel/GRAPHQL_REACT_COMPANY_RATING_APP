import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import './App.css';

import AppRouter from './router/AppRouter';
import NoInternet from './components/NoInternet';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Offline>
          <NoInternet />
        </Offline>
        <Online>
          <AppRouter />
        </Online>
      </React.Fragment>
    );
  }
}

export default App;
