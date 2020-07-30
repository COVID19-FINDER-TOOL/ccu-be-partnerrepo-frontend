import React from 'react';
import classes from './App.module.css';
import Header from './Components/Header/Header';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import Footers from './Components/Footers/Footers';
import CacheCleaner from './CacheCleaner.js'


function App() {
  return (
    <CacheCleaner>
      {({ loading, isLatestVersion, refreshCacheAndReload }) => {
        if (loading) return null;
        if (!loading && !isLatestVersion) {
          // You can decide how and when you want to force reload
          refreshCacheAndReload();
        }

        return (
          <Router basename="/csf">
            <Header />
            <Container className={classes.App}>
              <Switch>
                <Route exact path='/' component={WelcomePage} />
              </Switch>
            </Container >
            <Footers />
          </Router>
        );
      }}
    </CacheCleaner>
  );

}

export default App;
