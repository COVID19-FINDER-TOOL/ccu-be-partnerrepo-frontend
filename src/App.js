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
import { propTypes } from 'react-bootstrap/esm/Image';
import { baseUIURL } from './AxiosHandler';
import ProgressWeb from './Components/ProgressWeb/ProgressWeb';

function App() {

  const [showCover, setShowCover] = useState(true)

  useEffect(() => {
    // console.log(window.location.href)
    if (window.location.href === baseUIURL) {
      setTimeout(function () {
        setShowCover(false)
      }, 8000)
    } else {
      setShowCover(false)
    }
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
            <div style={{ display: showCover == true ? "block" : "none" }} className={classes.coverPage}>
              <Container className={classes.containertransform}>
                <div className={classes.main}>
                  <Row className={classes.containerCover}>
                    <img className={classes.logoImage} src={require("./assets/Images/Image 8.png")}></img>
                    {/* <div class={classes.vl}></div> */}
                    <img className={classes.logoImage} src={require("./assets/Images/Image 7.png")}></img>
                  </Row>
                  <Row className={classes.appNameRow}>
                    <h1 className={classes.appName}>SUPPORT FINDER TOOL</h1>
                  </Row>
                  <Row className={classes.containerCover}>
                    <img className={classes.logoImage} src={require("./assets/Images/Support_finder_logo2x.png")}></img>

                  </Row>
                </div>
                <Row className={classes.appSignatureRow}>
                  <h3 className={classes.signature}>Powered by <br /> The University of Edinburgh and Sopra Steria <br /> <span className={classes.span}>In collaboration with various charities</span> </h3>
                </Row>
              </Container>
            </div>
            <div style={{ display: showCover == false ? "block" : "none", minHeight:"100%" }}>
              <Router basename="/">
                {/* <Header /> */}
                <div className={classes.App}>
                  <Container fluid={true}>
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


