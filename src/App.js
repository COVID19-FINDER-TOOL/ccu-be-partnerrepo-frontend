import React, { useState, useEffect } from 'react';
import classes from './App.module.scss';

import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import CacheCleaner from './CacheCleaner.js'
import { connect } from "react-redux";
import 'animate.css/animate.css'
import { baseUIURL } from './AxiosHandler';

import Loadable from "react-loadable";
import Loading from './Components/Loading/LoadingPage.js'

const WelcomePage = Loadable({
  loader:() => import('./Components/WelcomePage/WelcomePage'),
  loading: Loading
});
const Chatbot = Loadable({
  loader:() => import('./Components/Chatbot/Chatbot'),
  loading:Loading
});
const Feedback = Loadable({
  loader:() => import('./Components/Feedback/Feedback'),
  loading: Loading
});
const FloatingButton = Loadable({
  loader:() => import('./Components/FloatingButton/FloatingButton'),
  loading: Loading
});

function App() {
  const [showCover, setShowCover] = useState(true)
  const mobile = window.matchMedia("(max-width: 767px)").matches;

  useEffect(() => {
    // console.log(window.location.href)
    if (window.location.href === baseUIURL) {
      setTimeout(function () {
        setShowCover(false)
      }, 8000)
    } else {
      setShowCover(false)
    }
  },[]);
  return (
    // <Suspense fallback={<div>Loading</div>}>

    <CacheCleaner>
      {({ loading, isLatestVersion, refreshCacheAndReload }) => {
        if (loading) return null;
        if (!loading && !isLatestVersion) {
          // You can decide how and when you want to force reload
          refreshCacheAndReload();
        }

        return (
          <>
              <Router basename="/">
                {/* <Header /> */}
                <div className={classes.App}>
                  <Container fluid={true}>
                    <Switch>
                      <Route path='/chatbot' component={Chatbot} />
                      <Route path='/feedback' component={Feedback} />
                      <Route exact path='/' component={WelcomePage} />
                    </Switch>
                    {mobile ? <div className={classes.floatingButton}><FloatingButton isOpen={true}></FloatingButton></div>:null}
                  </Container >
                </div>
                {/* {!mobile ? <Footers></Footers>:null} */}
              </Router>
          </>
        );
      }}
    </CacheCleaner>
    // </Suspense>

  );

}
const mapStateToProps = state => {
  let payload = state.oppSerch

  return { payload };
};

export default connect(mapStateToProps, null, null, { pure: false })(App);


