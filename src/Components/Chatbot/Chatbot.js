import React, { useState, useEffect } from 'react'
import classes from './Chatbot.module.css';
import { Form, Card } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { axiosInstance } from '../../AxiosHandler';
import Spinner from 'react-bootstrap/Spinner';

class Chatbot extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: "",
            msg:false,
            condition:"",
            showSpinner:true,
        }
    }

    componentDidMount = () => {
        const data = { "question": "Yes" }
        axiosInstance.post("generateAnswer", data)
            .then(res => {
                const data = res.data.answers[0];
                this.setState(() => { return { data: data, showSpinner:false } });
                console.log(data, this.state.data);
            }).catch(error => {
                console.log(error);
            });
    }


    handleRadio = (event) => {
        const id = event.target.id
        this.setState(() => { return { condition: id } });
        this.setState(() => { return { msg: false } });
    }

    handleSubmit = () => {
       this.state.condition ? this.props.history.push("/feedback") : this.setState(() => { return { msg: true } });;
    }

    createForm = (prompts) => {
        const radios = prompts.map((x, index) => {
            return (
                <CustomRadio radioLabel={x.displayText} id={index + 1} key={index + 1} onClick={this.handleRadio} />
            )
        })
        return (radios);
    }

    render() {
        const question = this.state.data ? this.state.data.answer.slice(2) : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts) : console.log()
        return (
            <div>
                <div style={{ display: this.state.showSpinner?"block":"none" }}><img className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>
                <h1 className={classes.headingH1}>{question}</h1>
                <Form>
                    {this.state.msg ? <h5 className={classes.error}>*Please select an option</h5> : null}
                    {radios ? radios : ""}
                    <p className={classes.para}>Is there more than one option that describes your sitaution? Please select the one that is most important to address now and we'll get back to this question to cover the rest.</p>
                    <CustomButton type="submit" onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton>
                </Form>

            </div>

        );
    }
}

export default Chatbot;