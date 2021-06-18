import React from 'react'
import Header from '../Header/Header';
import classes from './WelcomePage.module.scss';
import { Form, Row, Col, Container } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import Footers from '../../Components/Footers/Footers';
import { axiosInstance, axiosLoginInstance } from '../../AxiosHandler';
import moment from "moment";
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { login, onEditInspection } from "../../store/Action/LoginAction";
import axios from 'axios';
import packageJson from '../../../package.json';
import PropTypes from 'prop-types';
import OptionButtons from '../OptionButtons/OptionButtons';
global.appVersion = packageJson.version;

class WelcomePage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      start: false,
      part: false,
      agree: 0,
      toggle: 0,
      msg: 0,
      data: "",
      links: [],

    }
  }

  componentDidMount = () => {
    axios({
      method: 'get',
      url: process.env.REACT_APP_UI + 'properties.json?v=' + global.appVersion,
    }).then((response) => response.data)
      .then((prop) => {
        const welcomeLinks = prop.Welcomelinks
        this.setState(() => { return { links: welcomeLinks } })

      });

    // const data = { "question": "mark one testing done" }
    // axiosInstance.post("generateAnswer", data)
    //   .then(res => {
    //     const data = res.data.answers[0];
    //     this.setState(() => { return { data: data } });
    //   }).catch(error => {
    //     console.log(error);
    //   });
  }


  handleStart = () => {
    if (window.localStorage.getItem("csf_user")) {
      const user = JSON.parse(window.localStorage.getItem("csf_user"))

      this.props.history.push("/Chatbot");

    } else {
      this.handleSubmit()
    }
  }


  generateUID = () => {

    const user = {
      user_id: "UID" + moment.utc().format('DDMMYYThhmmssSSS'),
      creation_time: moment.utc().format('YYYY-MM-DD hh:mm:ss')
    }
    window.localStorage.setItem('csf_user', JSON.stringify(user));
    this.props.history.push("/Chatbot");
    this.props.login({ user: user })
    axiosLoginInstance.post("CFTUserIdTrigger/user", user)
      .then(res => {
        console.log(res.data)
      }).catch(error => {
        console.log(error);
      });
  }

  handleSubmit = () => {
    this.generateUID()

  }

  handleBack = () => {
    this.setState(() => { return { toggle: 0 } });
  }

  handlePart = () => {
    this.setState(() => { return { part: true } })
  }

  showHomeModal = () => {
    this.setState(() => { return { part: false } })
}

  render() {

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const btn = <CustomButton float={"left"} margin={mobile ? "" : "20px 0 0 0"} width={mobile ? "100%" : ""} type="submit" onClick={this.handleStart} data={litrals.buttons.startButton}></CustomButton>

    return (
      <div className={classes.backgrondImage}>
        {this.state.part? <Header heading = {this.state.part ? "8":undefined} showHomeModal={this.showHomeModal}></Header> : null}
        <Container style={{ display: !this.state.part ? "flex" : "none"}}  className={classes.wlcmRow1}>
          
        <h1 className={classes.para}>{litrals.welcome.text1}</h1>
          {/* <p className={classes.para}>{litrals.welcome.text2}</p> */}
          <CustomButton float={"left"} type="submit" width={mobile ? "100%" : ""} margin={mobile ? "" : "20px 0 0 0"} onClick={this.handlePart} data={litrals.buttons.getStartedButton}></CustomButton>
            
        

        </Container>


        <Container style={{ display: this.state.part ? "block" : "none" }}>
          <Row className={classes.wlcmRow}>

            <Col md={6}>
              <p className={classes.leftText}>
                {litrals.welcome.text4}
              </p>
            </Col>
            <Col md={6}  className={classes.colTabs}>
              <div>
                {/* <OptionButtons partition={true} array={litrals.welcome.ribbonButtons} /> */}
                <h3 className={classes.tabsHeading}>What you need to do</h3>
                <h5 className={classes.tabsSubHeading}>Tell us about your situation </h5>
                <p className={classes.tabsPara}>None of your personal information will be stored or shared.</p>
                <h5 className={classes.tabsSubHeading}>Review your options </h5>
                <p className={classes.tabsPara}>Based upon your responses, we'll provide you with free support options and guidance.</p>
                <h5 className={classes.tabsSubHeading}>Review your action plan </h5>
                <p className={classes.tabsPara}>Set a set of actions away with you which will help you to become more financially and emotional resilient.</p>
                <h5 className={classes.tabsSubHeading}>Learn from others </h5>
                <p className={classes.tabsPara4}>Learn about other people's experiences and how they overcome similar situations. </p>

              </div>
              <div>
              </div>
            </Col>
          </Row>

        </Container>

        {!mobile ? <Footers format = {this.state.part} buttonpanel = {btn}></Footers>:null}


      </div>
    );
  }
}

const mapStateToProps = state => {
  return { payload: state.surveyData };
};

const mapDispatchToProps = dispatch => {
  return {
    login: data => dispatch(login(data)),
    // onEditInspection: data => dispatch(onEditInspection(data)),
    surveyData: data => dispatch(surveyData(data))
  };
};

const WelcomePageData = connect(mapStateToProps, mapDispatchToProps)(WelcomePage);

WelcomePageData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (WelcomePageData);
