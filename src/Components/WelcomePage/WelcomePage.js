import React from 'react'
import Header from '../Header/Header';
import classes from './WelcomePage.module.scss';
import { Form, Row, Col, Container } from 'react-bootstrap';
// import CustomRadio from '../CustomRadio/CustomRadio';

import litrals from '../Litrals/Litrals';
import Footers from '../../Components/Footers/Footers';
import { axiosLoginInstance } from '../../AxiosHandler';
import moment from "moment";
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { login, onEditInspection } from "../../store/Action/LoginAction";
import axios from 'axios';
import packageJson from '../../../package.json';
import PropTypes from 'prop-types';
import CustomSelect from '../CustomSelect/CustomSelect';
// import OptionButtons from '../OptionButtons/OptionButtons';
// import CustomButton from '../CustomButton/CustomButton';

import Loadable from "react-loadable";
import Loading from '../Loading/LoadingPage'
import loader from '../../assets/Images/Spinner-1s-200px.svg'; // with import


import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const CustomButton = React.lazy(() => import('../CustomButton/CustomButton'));

// Loadable({
//   loader:() => import('../CustomButton/CustomButton'),
//   loading: Loading
// });
global.appVersion = packageJson.version;
class WelcomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            start: false,
            part: 1, // 1 for 1st page, 2 for user form , 3 for info page,
            agree: 0,
            toggle: 0,
            msg: 0,
            data: "",
            links: [],
            disagree: 0,
            language: 'English',
            required: 'Yes',
            showCloseIcon: false,
            disable: true,
            age: [
                {
                  "id": 1,
                  "value": "18-24"
                },
                {
                  "id": 2,
                  "value": "25-31"
                },
                {
                  "id": 3,
                  "value": "32-38"
                },
                {
                  "id": 4,
                  "value": "39-45"
                },
                {
                  "id": 5,
                  "value": "46-52"
                },
                {
                  "id": 6,
                  "value": "53-59"
                },
                {
                  "id": 7,
                  "value": "65-71"
                },
                {
                  "id": 8,
                  "value": "72-78"
                },
                {
                  "id": 9,
                  "value": "79-85"
                },
                {
                  "id": 10,
                  "value": "85+"
                }
              ],
              indebt: [
                {"id": 1, "value": "Yes"},
                {"id": 2, "value": "No"},
                {"id": 3, "value": "Unsure"}
              ],
              contact: [
                {"id": 1, "value": "Yes"},
                {"id": 2, "value": "No"},
                {"id": 3, "value": "Prefer not to answer"}
              ],
              Reason: [
                {"id": 1, "value": "Work/Lack of work in previous country"},
                {"id": 2, "value": "Education/lack of education in previous country"},
                {"id": 3, "value": "Threat to physical safety/health in home country"},
                {"id": 4, "value": "Marriage"},
                {"id": 5, "value": "Family"},
                {"id": 6, "value": "Prefer not to say"},
                {"id": 7, "value": "Involuntary travel"}
              ],

        }
    }

    componentDidMount = () => {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };
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
        this.setState({
            ...this.state,
            start: true
        })
        if (window.localStorage.getItem("csf_user")) {
            const user = JSON.parse(window.localStorage.getItem("csf_user"))
            // this.props.history.push("/Chatbot");
            this.props.onEditInspection({ disagree: this.state.disagree })
            this.props.history.push('/Chatbot')
        } else {
            this.handleSubmit()
        }
    }

    handleDisagree = () => {


        this.setState(() => {
            return { disagree: 1 }
        })
        setTimeout(() => {
            this.handleStart();
        }, 100)



    }


    generateUID = () => {

        const user = {
            user_id: "UID" + moment.utc().format('DDMMYYThhmmssSSS'),
            creation_time: moment.utc().format('YYYY-MM-DD hh:mm:ss')
        }
        window.localStorage.setItem('csf_user', JSON.stringify(user));
        // this.props.history.push("/Chatbot");
        this.props.onEditInspection({ disagree: this.state.disagree })
        this.props.history.push('/Chatbot')
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
            this.setState(() => { return { part: 3 } })
    }

    // showHomeModal = () => {
    //     this.setState(() => { return { part: false } })
    // }

    handleLanguageChange = (event) => {
        console.log("Language",event.target.value);
        this.setState(() => {
            return {
                language: event.target.value
            };
        })
    };

    handleRequireChange = (event) => {
        console.log("Require",event.target.value);
        this.setState(() => {
            return {
                required: event.target.value
            };
        })
    };

    showUserForm = () => {
        this.setState(() => { return { part: 2 } })
      }
    
      showHomeModal = () => {
        this.setState(() => { return { part: 1 } })
      }

    render() {

        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const btn = <div >

            <CustomButton float={"left"}
                margin={mobile ? "" : "20px 15px 0 0"}
                width={mobile ? "100%" : ""}
                type="submit"
                onClick={this.handleDisagree}
                data={litrals.buttons.disagreeButton}>
            </CustomButton>
            <CustomButton float={"left"}
                margin={mobile ? "" : "20px 0 0 0"}
                width={mobile ? "100%" : ""}
                type="submit"
                onClick={this.handleStart}
                data={litrals.buttons.startButton}>
            </CustomButton>


        </div>

const btn_second = <div>
                <CustomButton float={"left"}
                margin={mobile ? "" : "20px 15px 0 0"}
                width={mobile ? "100%" : ""}
                type="submit"
                onClick={this.showHomeModal}
                data={litrals.buttons.backNav}>
                </CustomButton>
                <CustomButton float={"left"}
                margin={mobile ? "" : "20px 0 0 0"}
                width={mobile ? "100%" : ""}
                type="submit"
                onClick={this.handlePart}
                data={litrals.buttons.submitForm}
                disabled={!this.state.disable}
                >
                </CustomButton>
                </div>

        return (
            <div className={classes.backgrondImage}>
                {this.state.part != 1 ? <Header showCloseIcon={this.state.showCloseIcon} heading={this.state.part != 1 ? "8" : undefined} showHomeModal={this.showHomeModal}></Header> : null}
                <Container style={{ display: this.state.part == 1 ? "flex" : "none" }} className={classes.wlcmRow1}>
                    {/* <h1 className={classes.para0}>{litrals.welcome.text0}</h1>
                    <h1 className={classes.para0}>{litrals.welcome.text1}</h1> */}
                    <h1 className={classes.para}>{litrals.welcome.textNew}</h1>
                    <p className={classes.disclaimerPara}>{litrals.welcome.desclaimer}<br /> <br/><b>{litrals.welcome.desclaimerBold}</b></p>
                    {/* <p className={classes.para}>{litrals.welcome.text2}</p> */}
                   <div className={classes.queContainer}>
                    <div className={classes.selectContainer}>
                    <label className={classes.selectLabel}>Which of the following nationalities do you associate with?</label>
                    <Box sx={{ width: 200, fontSize: '14px !important', flexDirection: 'column', display: 'table-cell', padding: '10px 20px' }}>
                        <FormControl fullWidth>
                            
                            <Select
                                labelId="language-label"
                                id="language-select"
                                value={this.state.language}
                                label="Language"
                                onChange={this.handleLanguageChange}
                               
                            >
                                <MenuItem value="English">English</MenuItem>
                                <MenuItem value="Español">Español</MenuItem>
                                <MenuItem value="Français">Français</MenuItem>
                                <MenuItem value="Deutsch">Deutsch</MenuItem>
                                <MenuItem value="Shqiptare">Shqiptare</MenuItem>
                                <MenuItem value="Tiếng Việt">Tiếng Việt</MenuItem>
                                <MenuItem value="Italiano">Italiano</MenuItem>
                                <MenuItem value="Română">Română</MenuItem>
                                <MenuItem value="Not_listed">My language is not listed here</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    </div>
                    <div className={classes.selectContainer}>
                    <label className={classes.selectLabel}>Do you require immediate help or do you feel unsafe in your current situation?</label>
                    <Box sx={{ width: 200, fontSize: '14px !important', flexDirection: 'column', display: 'table-cell', padding: '10px 20px' }}>
                        <FormControl fullWidth>
                            
                            <Select
                                labelId="required-label"
                                id="required-select"
                                value={this.state.required}
                                label="Required"
                                onChange={this.handleRequireChange}
                               
                            >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    </div>
                    </div>
                    <CustomButton
                        float={"left"} type="submit"
                        width={mobile ? "100%" : ""}
                        margin={mobile ? "" : "40px 0 0 0"}
                        onClick={this.showUserForm}
                        data={litrals.buttons.getStartedButton}>

                    </CustomButton>
                    {/* <img src={require('../../assets/Images/Spinner-1s-200px.svg')}/> */}
                </Container>


                <div style={{ display: this.state.part == 3 ? "block" : "none" }}>
                    <div className={classes.wlcmRow}>
                        <Row>
                            <Col xs={12} md={6}>
                                <h3 className={classes.leftText}>
                                    {litrals.welcome.text4}
                                </h3>
                            </Col>
                            <Col xs={12} md={6} className={classes.colTabs}>
                                <div>
                                    {/* <OptionButtons partition={true} array={litrals.welcome.ribbonButtons} /> */}
                                    <h3 className={classes.tabsHeading}>What we need to do</h3>
                                    <h5 className={classes.tabsSubHeading}>Tell us about your situation </h5>
                                    <p className={classes.tabsPara}>None of your personal information will be stored or shared.</p>
                                    <h5 className={classes.tabsSubHeading}>Find appropriate support</h5>
                                    <p className={classes.tabsPara}>Based upon your responses, we’ll send you an email with various support options and guidance to help you deal with your situation.</p>
                                    <h5 className={classes.tabsSubHeading}>Step-by-step action plan</h5>
                                    <p className={classes.tabsPara}>To help you work through the different support options we will provide a set of actions which you can step through in your own time. These will help you manage your current situation, but also help you become more financially, physically or emotionally resilient over time.</p>
                                    <h5 className={classes.tabsSubHeading}>Learn from others </h5>
                                    <p className={classes.tabsPara4}>Learn about other people's experiences and how they overcome similar situations. </p>

                                </div>
                                <div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </div>

                <div style={{ display: this.state.part == 2 ? "block" : "none" }}>
                        {/* <div style={{ display: this.state.showSpinner ? "block" : "none" }}>
                            <img alt="Loading...!!! " className={classes.spinner} src={loader}></img>
                            </div> */}
                        <div>

                        { !this.state.showSpinner ? 
                        <div className={classes.wlcmRow}>
                            <Row>
                            <Col xs={12} md={6}>
                                <h3 className={classes.leftText}>
                                Please help us with the following details
                                </h3>
                            </Col>
                            <Col xs={12} md={6} className={classes.colTabs}>
                                <div>
                                {/* <OptionButtons partition={true} array={litrals.welcome.ribbonButtons} /> */}
                                {/* <h3 className={classes.tabsHeading}>What we need to do</h3> */}

                            {/* Q.1 starts */}
                                <h5 className={classes.tabsSubHeading}>Q.1 - Which is your age bracket? </h5>
                                <p className={classes.queDisclaimer}> We want you to know that in the UK, there are support services which are different for different ages and we therefore want to ensure your support is specific for you.</p>
                                <CustomSelect 
                                    optionValue={this.state.age} 
                                    id="age"
                                    onClick={this.handleChange}
                                />
                                <p className={classes.tabsPara}></p>

                            {/* Q.2 starts */}
                                <h5 className={classes.tabsSubHeading}>Q.2 - As a result of your arrival in the UK, are you indebted to someone? </h5>
                                <p className={classes.queDisclaimer}></p>
                                <CustomSelect 
                                    optionValue={this.state.indebt} 
                                    id="indebt"
                                    onClick={this.handleChange}
                                />
                                <p className={classes.tabsPara}></p>
                                
                            {/* Q.3 starts */}
                            <h5 className={classes.tabsSubHeading}>Q.3 - Are you still in contact with the person who arranged for your travel to the UK? </h5>
                            <p className={classes.queDisclaimer}>We want you to know that support services will always prioritise your safety.</p>
                                <CustomSelect 
                                    optionValue={this.state.contact} 
                                    id="contact"
                                    onClick={this.handleChange}
                                />
                                <p className={classes.tabsPara}></p>

                                
                                
                            {/* Q.4 starts */}
                            <h5 className={classes.tabsSubHeading}>Q.4 - What is the reason for your travel to the UK **(multiple options available)?**</h5>
                            <p className={classes.queDisclaimer}>We want you to know that no matter what you have experienced there are support services available and these are accessed by all different kinds of people. There is support for things related to how you feel physically, emotionally and then things you may need practically such as work or education.</p>
                                <CustomSelect 
                                    optionValue={this.state.Reason} 
                                    id="reason"
                                    onClick={this.handleChange}
                                />
                                <p className={classes.tabsPara}></p>
                              
                                </div>
                                <div>
                                </div>
                            </Col>
                            </Row>
                        </div>

                        : ''}

                        </div>
                    </div>

                {!mobile ? <Footers format={this.state.part != 1} buttonpanel={this.state.part == 2 ? btn_second : btn}></Footers> : this.state.start && btn}
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
        onEditInspection: data => dispatch(onEditInspection(data)),
        surveyData: data => dispatch(surveyData(data))
    };
};

const WelcomePageData = connect(mapStateToProps, mapDispatchToProps)(WelcomePage);

WelcomePageData.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (WelcomePageData);
