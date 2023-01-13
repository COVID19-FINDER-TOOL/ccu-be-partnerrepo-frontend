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
            sp: [
                {
                  "id": 1,
                  "value": "Finding somewhere to live"
                },
                {
                  "id": 2,
                  "value": "Securing a visa"
                },
                {
                  "id": 3,
                  "value": "Proving my identity or address"
                },
                {
                  "id": 4,
                  "value": "Opening a bank account"
                },
                {
                  "id": 5,
                  "value": "Getting a mobile phone or mobile data (SIM)"
                },
                {
                  "id": 6,
                  "value": "Finding work or starting a business"
                },
                {
                  "id": 7,
                  "value": "Benefits and other income"
                },
                {
                  "id": 8,
                  "value": "Travel within UK"
                },
                {
                  "id": 9,
                  "value": "Reading, writing or speaking in English"
                },
                {
                  "id": 10,
                  "value": "Understanding UK culture"
                }
              ]
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
        this.setState(() => { return { part: 2 } })
      }

    render() {

        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const btn = <div >

            <CustomButton float={"left"}
                margin={mobile ? "" : "20px 15px 0 0"}
                width={mobile ? "100%" : ""}
                type="submit"
                onClick={() => this.setState(() => { return { part: 1 } })}
                data={litrals.buttons.disagreeButton}>
            </CustomButton>
            <CustomButton float={"left"}
                margin={mobile ? "" : "20px 0 0 0"}
                width={mobile ? "100%" : ""}
                type="submit"
                onClick={this.handlePart}
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
                onClick={this.handleStart}
                data={litrals.buttons.submitForm}
                disabled={!this.state.disable}
                >
                </CustomButton>
                </div>

        return (
            <div className={classes.backgrondImage}>
                {this.state.part != 1 ? <Header showCloseIcon={this.state.showCloseIcon} heading={this.state.part != 1 ? "8" : undefined} showHomeModal={this.showHomeModal}></Header> : null}
                <Container style={{ display: this.state.part == 1 ? "flex" : "none" }} className={classes.wlcmRow1}>
                    <h1 className={classes.para}>{litrals.welcome.textNew}</h1>
                    <div className={classes.queContainer}>
                    <div className={classes.selectContainer}>
                    <label className={classes.selectLabel}>What is your preferred language?</label>
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
                                <MenuItem value="Українці">Українці (Ukranian)</MenuItem>
                                <MenuItem value="Россия">Россия (Russian)</MenuItem>
                                <MenuItem value="Arabic – standard">Arabic – standard</MenuItem>
                                <MenuItem value="Arabic – mesopotamian">Arabic – mesopotamian</MenuItem>
                                <MenuItem value="Azerbaijani / Azeri">Azerbaijani / Azeri</MenuItem>
                                <MenuItem value="Hausa">Hausa</MenuItem>
                                <MenuItem value="Kurdish">Kurdish</MenuItem>
                                <MenuItem value="Pashto">Pashto</MenuItem>
                                <MenuItem value="Persian – Dari">Persian – Dari</MenuItem>
                                <MenuItem value="Persian – Farsi">Persian – Farsi</MenuItem>
                                <MenuItem value="Turkish">Turkish </MenuItem>
                                <MenuItem value="Yoruba">Yoruba</MenuItem>
                                <MenuItem value="Not_listed">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    </div>
                    
                    </div>
                    
                    <p className={classes.disclaimerPara}>{litrals.welcome.desclaimer}<br /> <br/>
                        {/* <span className={classes.disclaimerSpan}>{litrals.welcome.desclaimerBold}</span> */}
                    </p>
                    {/* <p className={classes.para}>{litrals.welcome.text2}</p> */}
                   
                    <CustomButton
                        float={"left"} type="submit"
                        width={mobile ? "100%" : ""}
                        margin={mobile ? "" : "40px 0 0 0"}
                        onClick={this.showUserForm}
                        data={litrals.buttons.getStartedButton}>

                    </CustomButton>
                    {/* <img src={require('../../assets/Images/Spinner-1s-200px.svg')}/> */}
                </Container>


                <div style={{ display: this.state.part == 2 ? "block" : "none" }}>
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
                                    <h3 className={classes.tabsHeading}>Three simple steps</h3>
                                    <h5 className={classes.tabsSubHeading}>1. Tell us about your situation </h5>
                                    <p className={classes.tabsPara}>None of your personal information will be stored or shared.</p>
                                    <h5 className={classes.tabsSubHeading}>2. Learn about your support options</h5>
                                    <p className={classes.tabsPara}>We will share support options that are most relevant to you, with links to online information.</p>
                                    <h5 className={classes.tabsSubHeading}>3. Step-by-step action plan</h5>
                                    <p className={classes.tabsPara}>If you provide an email address, we will email you an action plan to access support. This is just for you. We do not store it or share it, but you can share it with people who are helping you.</p>
                                    {/* <h5 className={classes.tabsSubHeading}>Learn from others </h5>
                                    <p className={classes.tabsPara4}>Learn about other people's experiences and how they overcome similar situations. </p> */}

                                </div>
                                <div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </div>

                <div style={{ display: this.state.part == 3 ? "block" : "none" }}>
                        {/* <div style={{ display: this.state.showSpinner ? "block" : "none" }}>
                            <img alt="Loading...!!! " className={classes.spinner} src={loader}></img>
                            </div> */}
                        <div>

                        { !this.state.showSpinner ? 
                        <div className={classes.wlcmRow}>
                            <Row>
                            <Col xs={12} md={6}>
                                <h3 className={classes.leftText}>
                                1. Tell us about your situation</h3>

                                      <p className={classes.tabsPara}>Please be reassured, you are welcome in the UK. Thank you for sharing information about your situation. We know it might be difficult to answer some of these questions. They will help us understand what support options are relevant to you. Please remember that, if you close the tool, your data isn’t saved.

                                </p>
                            </Col>
                            <Col xs={12} md={6} className={classes.colTabs}>
                                <div>
                                {/* <OptionButtons partition={true} array={litrals.welcome.ribbonButtons} /> */}
                                {/* <h3 className={classes.tabsHeading}>What we need to do</h3> */}

                            {/* Q.1 starts */}


                                <h5 className={classes.tabsSubHeading}>As an asylum seeker or refugee, I would like to learn about support options for: </h5>
                                <p className={classes.queDisclaimer}>Please select all that are relevant to you</p>
                                <CustomSelect 
                                    optionValue={this.state.sp} 
                                    id="sp"
                                    onClick={this.handleChange}
                                    isMulti="true"
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

                {!mobile ? <Footers format={this.state.part != 1} buttonpanel={this.state.part == 3 ? btn_second : btn}></Footers> : this.state.start && btn}
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
