import React from 'react';
import classes from './App.module.css';
import Header from './Components/Header/Header';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import Chatbot from './Components/Chatbot/Chatbot';
import EnterName from './Components/EnterName/EnterName';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import Footers from './Components/Footers/Footers';
import CacheCleaner from './CacheCleaner.js'
import Feedback from './Components/Feedback/Feedback';
import { connect } from "react-redux";



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
            <div className={classes.App}>
            <Container>
              <Switch>
                <Route path='/enter-name' component={EnterName}
                />
                <Route path='/chatbot' component={Chatbot}/>
                <Route path='/feedback' component={Feedback}/>
                <Route exact path='/' component={WelcomePage} />
              </Switch>
            </Container >
            </div>
            <Footers />
          </Router>
        );
      }}
    </CacheCleaner>
  );

}
const mapStateToProps = state => {
  let payload=state.oppSerch

  return {payload};
};

export default connect(mapStateToProps,null,null,{pure:false})(App);


 