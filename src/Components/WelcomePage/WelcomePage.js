import React from 'react'
import classes from './WelcomePage.module.css';
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
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

global.appVersion = packageJson.version;

const useStyles = theme =>({
  root: {
    maxWidth: "100%",
    margin: 40,
    marginLeft : 70,
    marginRight: 70, 
    paddingTop:"1%"  
  },
  media: {
    height: 140,
    width: "90%",
    display: "block",
    margin: "auto",
  },
  btn:{
    backgroundColor:"#a60726",
    color:"#f5f5f5",
    display: "block",
    margin: "auto",

    "&:hover": {
      color:"#f5f5f5",
      backgroundColor:"#ff7149"
    },
    "&:focus": {
      outline:"none",
      border:"none",
      backgroundColor:"#a60726"
    }

  }
});

class WelcomePage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      start: false,
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

    const data = { "question": "mark one testing done" }
    axiosInstance.post("generateAnswer", data)
      .then(res => {
        const data = res.data.answers[0];
        this.setState(() => { return { data: data } });
      }).catch(error => {
        console.log(error);
      });
  }


  handleStart = () => {
    if (window.localStorage.getItem("csf_user")) {
      const user = JSON.parse(window.localStorage.getItem("csf_user"))
      this.props.login({ user: user })
      this.props.history.push("/enter-name");

    } else {
      this.setState(() => { return { start: true } });
    }
  }

  handleRadio = (event) => {
    const id = event.target.id
    this.setState(() => { return { agree: id } });
    this.setState(() => { return { msg: false } });
  }

  generateUID = () => {
    const user = {
      user_id: "UID" + moment.utc().format('DDMMYYThhmmssSS'),
      creation_time: moment.utc().format('DD/MM/YY hh:mm:ss')
    }

    axiosLoginInstance.post("CFTUserIdTrigger/user", user)
      .then(res => {

        window.localStorage.setItem('csf_user', JSON.stringify(user));
        this.props.history.push("/enter-name");

      }).catch(error => {
        console.log(error);
      });
  }

  handleSubmit = () => {

    switch (this.state.agree) {
      case 0: this.setState(() => { return { msg: true } }); break;
      case "1": this.generateUID(); break;
      case "2": this.props.history.push("/feedback"); break;
      default: console.log(); break;
    }
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


  createLinks = () => {
    const {classes} = this.props;
    const links = litrals.welcome.links.map((x, index) => {
      return (

        <Card key={index} className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image= {require("../../assets/Images/" + this.state.links[index].image)}
              title=""
            />
          </CardActionArea>
          <CardActions>
            <Button className={classes.btn} size="small" color="primary">
              {x.buttonText}
        </Button>
          </CardActions>
        </Card>
      )
    })
    return (links);
  }

  render() {
    const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts) : console.log();
    const createLinks = this.state.links.length !== 0 ? this.createLinks() : console.log();
    return (
      <div>
        <div>
          <h1 className={classes.headingH1}>{litrals.welcome.heading}</h1>
          <p className={classes.para}>{litrals.welcome.text1}</p>
          {!this.state.start ?
            <div>
              {/* <p className={classes.para}>This tool is a simple ethical approach which all citizens should be guided through before being offered a quick fix product, loan or support. No matter how good or ethical it is. The tool contains a questionnaire of fifteen questions which will asses the citizens on the following four criteria:  </p> */}
              <CustomButton type="submit" onClick={this.handleStart} data={litrals.buttons.startButton}></CustomButton>
              <div className={classes.cardContainer} >
                {createLinks}

              </div>

            </div>

            :

            <Form>
              <legend className="legend">{this.state.data.answer.slice(3)}</legend>
              {this.state.msg ? <h5 className={classes.error}>*Please select an option</h5> : null}
              {radios ? radios : ""}
              <CustomButton type="submit" onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton>
            </Form>}
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

export default withStyles(useStyles, { withTheme: true })(WelcomePageData);
