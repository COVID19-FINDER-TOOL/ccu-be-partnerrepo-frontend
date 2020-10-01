import React from "react";
import classes from "./Login.module.scss";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CustomButton from "../CustomButton/CustomButton";
import litrals from "../Litrals/Litrals";
const Login = (props) => {
    return (
        <Form className={classes.form}>
            <Form.Group controlId="username">
                <Form.Label className={classes.label}>Username</Form.Label>
                <Form.Control type="text" />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label className={classes.label}>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>
            <CustomButton data={litrals.buttons.loginButton} type={"submit"}></CustomButton>
        </Form>
        
    );
}
export default Login