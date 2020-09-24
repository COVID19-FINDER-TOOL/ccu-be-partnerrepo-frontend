import React from 'react'
import { Container, Col, Row } from 'react-bootstrap';
import classes from './Feedback.module.scss';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrinAlt, faSmileBeam, faMeh, faFrown, faAngry } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { axiosFeedbackInstance } from '../../AxiosHandler';
import Header from '../Header/Header';
import moment from "moment";
import HomeIcon from '@material-ui/icons/Home';
import Footers from "../Footers/Footers";
class Feedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            section1: true,
            section2: false,
            section3: false,
            positives: false,
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
        id <= 2 ? this.setState(() => { return { section2: true, positives: true, smilySelected: id } }) : this.setState(() => { return { section2: true, positives: false, smilySelected: id } })
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
        axiosFeedbackInstance.post("feedback", feedback)
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState(() => { return { section1: false, section2: false, section3: false, section4: true } })
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { section1: false, section2: false, section3: false, section4: true } })
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

    render() {
        const mobile = window.matchMedia("(max-width: 600px)").matches;

        const positives = ["I found the support I needed", "I found stories and tips from other people helpful", "I found it easy to use the tool"]
        const negatives = ["I didn’t find any support options", "The support options shown weren’t relevant to me", "I found it difficult to use the tool"]
        const optionButtons = this.createButtons(this.state.section2 ? this.state.positives ? positives : negatives : -1);
        return (
            <div className={classes.backgrondImage}>
                <Header heading={7}></Header>
                <Container>
                    <Row>

                        {!mobile? <Col md={4} xs={1} style={{ padding: "0", marginTop : "2%" }}>
                            <p className={classes.logoPara}>
                                <img
                                    alt="SSlogo"
                                    src={require("../../assets/Images/Support_finder_logo.png")}
                                    width="50"
                                    style={{ marginRight: "1.2rem", cursor: "pointer", "box-boxShadow": "0px 3px 6px #00000029" }}
                                    onClick={() => { this.props.history.push("/") }}
                                />Support Finder</p>
                            {/* <Footers></Footers> */}
                        </Col>:""}

                        <Col style={{height:"90vh", overflow:'auto', paddingBottom:"10px"}}>
                            <div style={{ display: this.state.section1 ? "block" : "none" }}>
                                <h3 className={classes.headingH1}>How would you rate your experience with the tool?</h3>
                                <div className={classes.smilyContainer}>
                                    <FontAwesomeIcon id={1} icon={faGrinAlt} className={this.state.smilySelected ? this.state.smilySelected == 1 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 1)} />
                                    <FontAwesomeIcon id={2} icon={faSmileBeam} className={this.state.smilySelected ? this.state.smilySelected == 2 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 2)} />
                                    <FontAwesomeIcon id={3} icon={faMeh} className={this.state.smilySelected ? this.state.smilySelected == 3 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 3)} />
                                    <FontAwesomeIcon id={4} icon={faFrown} className={this.state.smilySelected ? this.state.smilySelected == 4 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 4)} />
                                    <FontAwesomeIcon id={5} icon={faAngry} className={this.state.smilySelected ? this.state.smilySelected == 5 ? classes.selected : classes.disabled : classes.smily} onClick={this.smilySelector.bind(this, 5)} />
                                </div>
                            </div>

                            <div style={{ display: this.state.section2 ? "block" : "none" }}>
                                <h3 className={classes.headingH1}>Please select from the following options:</h3>
                                <p className={classes.headingPara}><em>Note: you can select multiple options</em></p>
                                <div className={classes.smilyContainer}>
                                    {optionButtons}
                                </div>
                                {this.state.showNext ? <div className={classes.nextBtnDiv}><CustomButton width={mobile?"100%":""} type="submit" onClick={this.handleNext} data={litrals.buttons.nextStep}></CustomButton></div> : ''}

                            </div>

                            <div style={{ display: this.state.section3 ? "block" : "none" }}>
                                <h3 className={classes.headingHx}>Your feedback on how the tool can be improved to support more people would be greatly appreciated.</h3>
                                <Form.Group >
                                    <Form.Control id={11} onChange={this.handleTextBox} bsPrefix={classes.textarea} as="textarea" rows="3" placeholder={'Please share your thoughts and ideas here……'} />
                                </Form.Group>
                                <div className={classes.nextBtnDiv}><CustomButton type="submit" float={"right"} width={mobile?"100%":""} onClick={this.submitFeedback} data={litrals.buttons.SubmitNav}></CustomButton></div>
                            </div>
                            <div style={{ display: this.state.section4 ? "block" : "none" }}>
                                <h3 className={classes.headingH1}>Thank you for your valuable feedback.</h3>
                                <div className={classes.homebtn} onClick={() => { this.props.history.push("/") }}><HomeIcon style={{ fontSize: "1.7rem" }}></HomeIcon>Home</div>
                            </div>
                        </Col>
                    </Row>

                </Container>
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