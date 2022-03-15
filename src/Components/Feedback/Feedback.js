import React from 'react'
import { Container, Col, Row } from 'react-bootstrap';
import classes from './Feedback.module.scss';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import Form from 'react-bootstrap/Form';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { axiosLoginInstance } from '../../AxiosHandler';
import Header from '../Header/Header';
import moment from "moment";
import HomeIcon from '@material-ui/icons/Home';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import Footers from '../../Components/Footers/Footers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrinAlt, faSmileBeam, faMeh, faFrown, faAngry } from "@fortawesome/free-solid-svg-icons";

class Feedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            section1: true,
            section2: false,
            section3: false,
            section4: false,
            positives: false,
            neutral: false,
            negatives: false,
            showNext: true,
            answers: [],
            smilySelected: 0

        }
    }

    componentDidMount = () => {
        this.props.onEditInspection({ Feedback: { experience: "", answers: [], feedback: "" } })
    }

    smilySelector = (id) => {
        const exp = {
            1: "Satisfied",
            2: "Happy",
            3: "Unsatisfied",
            4: "Sad",
            5: "Angry"
        }
        const { CREATEJOURNEY } = this.props.payload;
        const { Feedback } = CREATEJOURNEY ? CREATEJOURNEY : ""
        const feedback = Feedback
        feedback.experience = exp[id]
        console.log(feedback)
        this.props.onEditInspection({ Feedback: feedback })
        id <= 2 ? this.setState(() => { return { section2: true, positives: true, neutral:false,smilySelected: id } }) : this.setState(() => { return { section2: true, positives: false, neutral: false,smilySelected: id } })
        if (id == 3) {
            this.setState(() => { return { section2: true, positives: false, neutral:true, smilySelected: id } }) 
        } 
    }

    handleNext = () => {
        this.setState(() => { return { section3: true, showNext: false } })
    }

    optionChecked = (event) => {
        const val = event.target;
        const id = event.target.id
        const { CREATEJOURNEY } = this.props.payload;
        const { Feedback } = CREATEJOURNEY ? CREATEJOURNEY : []
        var feedback = Feedback
        if (val.checked) {
            feedback.answers.push(id)
        }
        else if (!val.checked) {
            feedback.answers = feedback.answers.filter(x => x != id)
        }
        this.props.onEditInspection({ Feedback: feedback })

        id == 9 ? val.checked ? this.setState(() => { return { others: true } }) : this.setState(() => { return { others: false } }) : console.log()
    }

    handleTextBox = (e) => {
        var text = e.target.value
        var id = e.target.id
        const { CREATEJOURNEY } = this.props.payload;
        const { Feedback } = CREATEJOURNEY ? CREATEJOURNEY : ""
        var feedback = Feedback
        feedback.feedback = text;
        this.props.onEditInspection({ Feedback: feedback })
    }

    submitFeedback = () => {
        const { CREATEJOURNEY } = this.props.payload;
        const { Feedback } = CREATEJOURNEY ? CREATEJOURNEY : ""
        var feedback = Feedback
        feedback.user_id = JSON.parse(window.localStorage.getItem("csf_user")).user_id;
        feedback.feedback_time = moment.utc().format('YYYY-MM-DD hh:mm:ss');
        this.setState(() => { return { section1: false, section2: false, section3: false, section4: true } })
        axiosLoginInstance.post("CFTFeedbackTrigger/feedback", feedback)
            .then(res => {
                const data = res.data;
                console.log(data);
                window.localStorage.removeItem('csf_user')
            }).catch(error => {
                console.log(error);
            });


    }

    createButtons = (arr) => {
        if (arr !== -1) {
            const buttons = arr.map((x, index) => {
                return (
                    <div>

                        <label className={classes.label}>
                            <input type="checkbox" className={classes.checkbox} id={index + 6} key={index + 6} onChange={this.optionChecked}></input>
                            <div className={classes.optionButtons}>{x}</div>
                        </label>
                    </div>
                )
            })
            return (buttons)
        }

    }

    showHomeModal = () => {
        const { CREATEJOURNEY } = this.props.payload;
        const { Feedback } = CREATEJOURNEY ? CREATEJOURNEY : ""
        Feedback.experience && !this.state.section4 ?  this.setState(() => { return { showHomeModal: true } }) : this.props.history.push("/")
    }

    gotoHome = () => {
        this.props.onEditInspection({
            backStack: [],
            journey_id: "",
            metadata: "",
            questionStack: [],
            responseStack: [],
            section: 0,
            start_time: "",
            Feedback:""
        })
        this.props.history.push('/')

    }

    closeHomeModal = () => {
        this.setState(() => { return { showHomeModal: false } })
    }

    render() {
        const mobile = window.matchMedia("(max-width: 767px)").matches;

        const positives = ["Member got the support needed", "Member comfortable sharing personal circumstances", "Member happy with the length of time spent "]
        const neuterals = ["Member was neither satisfied or unsatisfied", "Member was slightly uncomfortable or vague in sharing personal circumstances", "Member already had information he needed"]
        const negatives = ["Member did not get the support needed", "Member was not comfortable sharing personal circumstances", "Member not happy with the length of time spent "]
        const optionButtons = this.createButtons(this.state.section2 ? this.state.positives ? positives : this.state.neutral ? neuterals : negatives : -1);
        return (
            <div className={classes.backgroundImage}>
                <Header heading={7} showHomeModal={this.showHomeModal}></Header>
                <ConfirmationModal modalFooter="dualButton" message={litrals.gotoHomefromFeedback} showModal={this.state.showHomeModal} onClick={this.gotoHome} onHide={this.closeHomeModal} />
                <Container>
                    <Row>
                        <Col style={{ height: "80vh", overflow: 'auto', paddingBottom: "4rem" }}>
                            <div style={{ display: this.state.section1 ? "block" : "none" }}>
                                <h5 className={classes.headingH1}>How would you rate the member’s experience with the tool?</h5>
                                <div className={classes.smilyContainer}>
                                   <div className={classes.smilyDiv}> <FontAwesomeIcon id={5} icon={faAngry} className={this.state.smilySelected ? this.state.smilySelected == 5 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 5)} /> </div>
                                   {/* <h6>Angry</h6>  */}
                                   <div className={classes.smilyDiv}> <FontAwesomeIcon id={4} icon={faFrown} className={this.state.smilySelected ? this.state.smilySelected == 4 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 4)} />  </div>
                                   {/* <h6>Sad</h6> */}
                                   <div className={classes.smilyDiv}> <FontAwesomeIcon id={3} icon={faMeh} className={this.state.smilySelected ? this.state.smilySelected == 3 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 3)} /> </div>
                                   {/* <h6>Not Satisifed</h6>  */}
                                   <div className={classes.smilyDiv}> <FontAwesomeIcon id={2} icon={faSmileBeam} className={this.state.smilySelected ? this.state.smilySelected == 2 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 2)} /> </div>
                                   {/* <h6>Satisifed</h6>  */}
                                   <div className={classes.smilyDiv}> <FontAwesomeIcon id={1} icon={faGrinAlt} className={this.state.smilySelected ? this.state.smilySelected == 1 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 1)} />  </div> 
                                   {/* <h6>Very Satisifed</h6> */}

                                    {/* <button id={1}  value={"satisfied"} className={this.state.smilySelected ? this.state.smilySelected == 1 ? classes.selected : classes.disabled : classes.smily} color onClick={this.smilySelector.bind(this, 1)}>Very Satisifed</button>
                                    <button id={2}  value={"satisfied"} className={this.state.smilySelected ? this.state.smilySelected == 2 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 2)} >Satisifed</button>
                                    <button id={3}  value={"satisfied"} className={this.state.smilySelected ? this.state.smilySelected == 3 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 3)} >Not Satisfied</button>
                                    <button id={4}  value={"satisfied"} className={this.state.smilySelected ? this.state.smilySelected == 4 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 4)} >Sad</button>
                                    <button id={5}  value={"satisfied"} className={this.state.smilySelected ? this.state.smilySelected == 5 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 5)} >Angry</button> */}
                                </div>
                            </div>

                            <div style={{ display: this.state.section2 ? "block" : "none" }}>
                                <h5 className={classes.headingH1}>Please select from the following options:</h5>
                                <p className={classes.headingPara}><em>Note: you can select multiple options</em></p>
                                <div className={classes.optionsContainer}>
                                    {optionButtons}
                                </div>
                                {this.state.showNext ? <div className={classes.nextBtnDiv}><CustomButton width={mobile ? "100%" : ""} type="submit" onClick={this.handleNext} data={litrals.buttons.nextStep}></CustomButton></div> : ''}

                            </div>

                            <div style={{ display: this.state.section3 ? "block" : "none" }}>
                                <h5 className={classes.headingHx}>Your feedback on how the tool can be improved to support more people would be greatly appreciated.</h5>
                                <Form.Group >
                                    <Form.Control id={11} onChange={this.handleTextBox} bsPrefix={classes.textarea} as="textarea" rows="3" placeholder={'Please share your thoughts and ideas here……'} />
                                </Form.Group>
                                <div className={classes.nextBtnDiv}><CustomButton type="submit" float={"right"} width={mobile ? "100%" : ""} onClick={this.submitFeedback} data={litrals.buttons.SubmitNav}></CustomButton></div>
                            </div>
                            <div style={{ display: this.state.section4 ? "block" : "none" }} className={classes.thanksdiv}>
                                <svg className={classes.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className={classes.checkmark__circle} cx="26" cy="26" r="25" fill="green" />
                                    <path className={classes.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>

                                <h5 className={classes.thankYou}>Thank you!</h5>
                                <h5 className={classes.feedbackImportance}> Your feedback is important to us. </h5>
                                <div className={classes.homebtn}><HomeIcon  onClick={this.gotoHome} style={{ fontSize: "2.7rem" }}></HomeIcon></div>
                            </div>
                        </Col>
                    </Row>

                </Container>

                {!mobile ? <Footers format = {true}></Footers>:null}
            </div>

        )
    }
}

const mapStateToProps = state => {
    return { payload: state.surveyData };
};

const mapDispatchToProps = dispatch => {
    return {
        onEditInspection: data => dispatch(onEditInspection(data)),
        surveyData: data => dispatch(surveyData(data))
    };
};

const FeedbackData = connect(mapStateToProps, mapDispatchToProps)(Feedback);

export default FeedbackData;