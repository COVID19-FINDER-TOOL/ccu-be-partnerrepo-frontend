import React, { useState, useEffect, lazy, Suspense } from 'react';
import classes from './App.module.scss';

import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import CacheCleaner from './CacheCleaner.js'
import { connect } from "react-redux";
import 'animate.css/animate.css'
import { onEditInspection } from "./store/Action/LoginAction";
import axios from 'axios';
import Loadable from "react-loadable";
import Loading from './Components/Loading/LoadingPage.js'

const WelcomePage =  React.lazy(() => import('./Components/WelcomePage/WelcomePage'));

// Loadable({
//   loader:() => import('./Components/WelcomePage/WelcomePage'),
//   loading: Loading
// });

const UserForm = React.lazy(() => import('./Components/UserForm/UserForm'));

const Chatbot = React.lazy(() => import('./Components/Chatbot/Chatbot'));

// Loadable({
//   loader:() => import('./Components/Chatbot/Chatbot'),
//   loading:Loading
// });
const Feedback =  React.lazy(() => import('./Components/Feedback/Feedback'));

// Loadable({
//   loader:() => import('./Components/Feedback/Feedback'),
//   loading: Loading
// });

const FloatingButton = React.lazy(() => import('./Components/FloatingButton/FloatingButton'));

// Loadable({
//   loader:() => import('./Components/FloatingButton/FloatingButton'),
//   loading: Loading
// });

const PrivacyPolicy = React.lazy(() => import("./Components/PrivacyPolicy/PrivacyPolicy"));

function App() {
  const [showCover, setShowCover] = useState(true)
  // const [keyVault, setKeyVault] = useState({})
  const mobile = window.matchMedia("(max-width: 767px)").matches;

  const callKeyVault = async() => {
    await axios.get("https://ccu-be-backendapi.azurewebsites.net/api/CFTKeyVaultMSITrigger/")
    .then(res=>{
      const data = res.data
      window.$keyVault = data
      console.log(window.$keyVault)
    })

  } 

  useEffect( ()=>{
    callKeyVault()
  }
  ,[]);
  
 

  return (
    <Suspense fallback={<div>Loading</div>}>

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
                    <Route path="/chatbot" component={Chatbot} />
                    <Route path="/userform" component={UserForm} />
                    <Route path="/feedback" component={Feedback} />
                    <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
                    <Route exact path="/" component={WelcomePage} />
                    <Route component={WelcomePage} />
                  </Switch>
                  {mobile ? (
                    <div className={classes.floatingButton}>
                      <FloatingButton isOpen={true}></FloatingButton>
                    </div>
                  ) : null}
                </Container>
              </div>
              {/* {!mobile ? <Footers></Footers>:null} */}
            </Router>
          </>
        );
      }}
    </CacheCleaner>
     </Suspense>

  );

}
const mapStateToProps = state => {
  let payload = state.oppSerch

  return { payload };
};

export default connect(mapStateToProps, null, null, { pure: false })(App);
