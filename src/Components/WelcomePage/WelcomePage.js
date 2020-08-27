import React from 'react'
import classes from './WelcomePage.module.scss';
import { Form } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { axiosInstance, axiosLoginInstance } from '../../AxiosHandler';
import moment from "moment";
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { login } from "../../store/Action/LoginAction";
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
      part: true,
      agree: 0,
      toggle: 0,
      msg: 0,
      data: "",
      links: []
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
      user_id: "UID" + moment.utc().format('DDMMYYThhmmssSS'),
      creation_time: moment.utc().format('YYYY-MM-DD hh:mm:ss')
    }

    axiosLoginInstance.post("CFTUserIdTrigger/user", user)
      .then(res => {
        this.props.login({ user: user })
        window.localStorage.setItem('csf_user', JSON.stringify(user));
        this.props.history.push("/Chatbot");

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

  createForm = (prompts) => {

    const radios = prompts.map((x, index) => {
      return (

        <CustomRadio radioLabel={x.displayText} id={index + 1} key={index + 1} onClick={this.handleRadio} />

      )
    })
    return (radios);
  }

  referToPage = () => {
    window.open("http://www.google.com")
  }

  handlePart = () =>{
    this.setState(()=> {return {part:false}})
  }

  render() {
    const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts) : console.log();
    return (
      <div className={classes.backgrondImage}>
        {/* <h1 className={classes.headingH1}>{litrals.welcome.heading}</h1> */}
        <div style={{display:this.state.part?"block":"none"}}>
          <p className={classes.para}>{litrals.welcome.text1}</p>
          <p className={classes.para}>{litrals.welcome.text2}</p>
          <CustomButton type="submit" onClick={this.handlePart} data={litrals.buttons.nextStep}></CustomButton>
        </div>


        <div style={{display:!this.state.part?"block":"none"}}>
          <h1 className={classes.text3}>{litrals.welcome.text3}</h1>
          <div className={classes.line}></div>
          <div>
            <OptionButtons partition={true} array={litrals.welcome.ribbonButtons} />
          </div>
          <div>
            <CustomButton type="submit" onClick={this.handleStart} data={litrals.buttons.startButton}></CustomButton>
          </div>
        </div>

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
