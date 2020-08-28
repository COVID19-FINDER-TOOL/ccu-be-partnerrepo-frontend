import React, { useState, useEffect } from 'react';
import classes from './App.module.scss';
import Header from './Components/Header/Header';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import Chatbot from './Components/Chatbot/Chatbot';
import EnterName from './Components/EnterName/EnterName';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import Footers from './Components/Footers/Footers';
import CacheCleaner from './CacheCleaner.js'
import Feedback from './Components/Feedback/Feedback';
import { connect } from "react-redux";
import Animate from 'animate.css-react'

import 'animate.css/animate.css'

function App() {

  const [showCover, setShowCover] = useState(true)

  useEffect(() => {
    setTimeout(function () {
      // var sass = require('node-sass');
      setShowCover(false)
    }, 4000)
  });

  return (
    <CacheCleaner>
      {({ loading, isLatestVersion, refreshCacheAndReload }) => {
        if (loading) return null;
        if (!loading && !isLatestVersion) {
          // You can decide how and when you want to force reload
          refreshCacheAndReload();
        }

        return (
          <>
            <div style={{ display: showCover == true ? "block" : "none" }}>
              <Container className={classes.containertransform}>
                <Row className={classes.containerCover}>
                  <img className={classes.logoImage} src={require("./assets/Images/Image 7.png")}></img>
                  <img className={classes.logoImage} src={require("./assets/Images/Image 8.png")}></img>
                </Row>
                <Row className={classes.appNameRow}>
                  <h1 className={classes.appName}>SUPPORT FINDER TOOL</h1>
                </Row>
                <Row className={classes.appNameRow}>
                  <h3 className={classes.signature}>Developed by <br /> The University of Edinburgh and Sopra Steria <br /> <span className={classes.span}>In collaboration with various charities</span> </h3>
                </Row>
              </Container>
            </div>
            <div style={{ display: showCover == false ? "block" : "none" }}>
              <Router basename="/">
                <Header />
                <div className={classes.App}>
                  <Container>
                    <Switch>
                      <Route path='/enter-name' component={EnterName}
                      />
                      <Route path='/chatbot' component={Chatbot} />
                      <Route path='/feedback' component={Feedback} />
                      <Route exact path='/' component={WelcomePage} />
                    </Switch>
                  </Container >
                </div>
                {/* <Footers /> */}
              </Router>
            </div>
          </>
        );
      }}
    </CacheCleaner>
  );

}
const mapStateToProps = state => {
  let payload = state.oppSerch

  return { payload };
};

export default connect(mapStateToProps, null, null, { pure: false })(App);


