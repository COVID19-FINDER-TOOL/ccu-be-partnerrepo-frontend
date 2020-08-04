import React, { useState } from "react";
import { Form } from 'react-bootstrap';
import CustomButton from '../CustomButton/CustomButton';
import classes from './EnterName.module.css';
import litrals from '../Litrals/Litrals';



const EnterName = (props) => {
    const [msg, setMsg] = useState(0);
    const [name, setName] = useState("");


    const handleNameChange = (event) => {
        setName(event.target.value);
        setMsg(false);
    }

    const nameSubmit = () => {
    name ? props.history.push("/chatbot"): setMsg(true);
    }
    return (
        <div >
            <h1 className={classes.headingH1}>What would you like us to call you?</h1>
            {msg ? <h5 className={classes.error}>*Please enter a value</h5> : null}
            <Form className={classes.nameInput}>
                <Form.Group controlId="name">
                    <Form.Control type="text" onChange={handleNameChange} defaultValue={name} autoComplete="off"/>
                </Form.Group>
                <p className={classes.para}>We don't mean to be nosy, but the more you can tell us about yourself, the more personalised support we can provide.</p>
                <CustomButton type="submit" onClick={nameSubmit} data={litrals.buttons.nextStep}></CustomButton>

            </Form>

        </div>
    )
}

export default EnterName;