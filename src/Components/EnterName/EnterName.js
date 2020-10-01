import React, { useState } from "react";
import { Form } from 'react-bootstrap';
import CustomButton from '../CustomButton/CustomButton';
import classes from './EnterName.module.scss';
import litrals from '../Litrals/Litrals';
import { surveyData } from "../../store/Action/SurveyAction";
import { onEditInspection } from "../../store/Action/LoginAction";
import { connect } from "react-redux";

const EnterName = (props) => {
    const [msg, setMsg] = useState(0);
    const [name, setName] = useState("");


    const handleNameChange = (event) => {
        setName(event.target.value);
        setMsg(false);
    }

    const nameSubmit = () => {
        if (name) {
            props.onEditInspection({ "name": name });
            props.history.push("/chatbot");
        } else {
            setMsg(true);
        }
    }
    return (
        <div >
            <h1 className={classes.headingH1}>What would you like us to call you?</h1>
            {msg ? <h5 className={classes.error}>*Please enter a value</h5> : null}
            <Form className={classes.nameInput}>
                <Form.Group controlId="name">
                    <Form.Control type="text" onChange={handleNameChange} defaultValue={name} autoComplete="off" />
                </Form.Group>
                <p className={classes.para}>We don't mean to be nosy, but the more you can tell us about yourself, the more personalised support we can provide.</p>
                <CustomButton type="submit" onClick={nameSubmit} data={litrals.buttons.nextStep}></CustomButton>

            </Form>

        </div>
    )
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

const EnterNameData = connect(mapStateToProps, mapDispatchToProps)(EnterName);


export default EnterNameData;