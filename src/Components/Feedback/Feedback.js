import React from 'react'
import classes from './Feedback.module.css';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrinAlt, faSmileBeam, faMeh, faFrown, faAngry } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form'

class Feedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            section1: true,
            section2: false,
            section3: false,
            positives: false,
            negatives: false,
            feedback : []
            
        }
    }

    smilySelector = (id) => {
        id <= 2 ? this.setState(() => { return { section2: true, section1: false, positives: true } }) : this.setState(() => { return { section2: true, section1: false, positives: false } })
    }

    handleNext = () => {
        this.setState(() => { return { section3: true, section2: false } })
    }

    optionChecked = (event) =>{
        const val = event.target;
         val.id==3 ? val.checked ? this.setState(() => { return { others :true } }) : this.setState(() => { return { others :false } }) : console.log()
    }

    createButtons = (arr) => {
        if (arr !== -1) {
            const buttons = arr.map((x, index) => {
                return (
                    <div>

                        <label className={classes.label}>
                            <input type="checkbox" className={classes.checkbox} id={index} onChange={this.optionChecked}></input>
                            <div className={classes.optionButtons}>{x}</div>
                        </label>
                    </div>
                )
            })
            return (buttons)
        }

    }

    render() {
        const positives = ["I found the support I needed", "I found stories and tips from other people helpful", "I found it easy to use the tool", "Other [Enter Text]"]
        const negatives = ["I didn’t find any support options", "The support options shown weren’t relevant to me", "I found it difficult to use the tool", "Other [Enter Text]"]
        const optionButtons = this.createButtons(this.state.section2 ? this.state.positives ? positives : negatives : -1);
        return (
            <div>
                <div style={{ display: this.state.section1 ? "block" : "none" }}>
                    <h3 className={classes.headingH1}>How would you rate your experience with the tool?</h3>
                    <div className={classes.smilyContainer}>
                        <FontAwesomeIcon id={1} icon={faGrinAlt} className={classes.smily} onClick={this.smilySelector.bind(this, 1)} />
                        <FontAwesomeIcon id={2} icon={faSmileBeam} className={classes.smily} onClick={this.smilySelector.bind(this, 2)} />
                        <FontAwesomeIcon id={3} icon={faMeh} className={classes.smily} onClick={this.smilySelector.bind(this, 3)} />
                        <FontAwesomeIcon id={4} icon={faFrown} className={classes.smily} onClick={this.smilySelector.bind(this, 4)} />
                        <FontAwesomeIcon id={5} icon={faAngry} className={classes.smily} onClick={this.smilySelector.bind(this, 5)} />
                    </div>
                </div>

                <div style={{ display: this.state.section2 ? "block" : "none" }}>
                    <h3 className={classes.headingH1}>How would you rate your experience with the tool?</h3>
                    <p className={classes.headingPara}><em>Note: you can select multiple options</em></p>
                    <div className={classes.smilyContainer}>
                        {optionButtons}
                    </div>
                    <div style={{ display: this.state.others ? "block" : "none" }} >
                        <Form.Group controlId="exampleForm.ControlTextarea2">
                            <Form.Control bsPrefix={classes.textareasmall} as="textarea" rows="3" placeholder={'Please type here'} />
                        </Form.Group>
                    </div>
                    <CustomButton type="submit" float={"right"} onClick={this.handleNext} data={litrals.buttons.nextStep}></CustomButton>

                </div>

                <div style={{ display: this.state.section3 ? "block" : "none" }}>
                    <h3 className={classes.headingH1}>Your feedback on how the tool can be improved to support more people would be greatly appreciated.</h3>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control bsPrefix={classes.textarea} as="textarea" rows="3" placeholder={'Please share your thoughts and ideas here……'} />
                    </Form.Group>
                    <CustomButton type="submit" float={"right"} onClick={() => { this.props.history.push("/") }} data={litrals.buttons.SubmitNav}></CustomButton>
                </div>
            </div>
        )
    }
}

export default Feedback;