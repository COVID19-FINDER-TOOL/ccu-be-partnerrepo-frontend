import React, { useState, useEffect } from 'react'
import classes from './WelcomePage.module.css';
import { Form, Card } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { axiosInstance } from '../../AxiosHandler';


class WelcomePage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      start: false,
      agree: 0,
      toggle: 0,
      msg: 0,
      data: ""
    }
  }

  componentDidMount = () => {
    const data = { "question": "mark one testing done" }
    axiosInstance.post("generateAnswer", data)
      .then(res => {
        const data = res.data.answers[0];
        this.setState(() => { return { data: data } });
        console.log(data, this.state.data);
      }).catch(error => {
        console.log(error);
      });
  }
  handleStart = () => {
    this.setState(() => { return { start: true } });
  }

  handleRadio = (event) => {
    const id = event.target.id
    this.setState(() => { return { agree: id } });
    this.setState(() => { return { msg: false } });
  }

  handleSubmit = () => {
    console.log(this.state.agree)
    
    switch(this.state.agree){
      case 0 : this.setState(() => { return { msg: true } }); break;
      case "1" : this.props.history.push("/enter-name");break;
      case "2" : this.props.history.push("/feedback");break;
      // default : this.props.history.push("/feedback");break;
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

  render() {
    const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts) : console.log()
    return (
      <div>
        <div>
          <h1 className={classes.headingH1}>Welcome to Covid-19 Support Finder</h1>
          <p className={classes.para}>The government, charities and community groups are offering financial and emotional support during the Covid-19 pandemic. Make sure you are aware what you are entitled to before applying for credit.</p>
          {!this.state.start ?
            <div>
              <p className={classes.para}>This tool is a simple ethical approach which all citizens should be guided through before being offered a quick fix product, loan or support. No matter how good or ethical it is. The tool contains a questionnaire of fifteen questions which will asses the citizens on the following four criteria:  </p>

              <div className={classes.cardContainer} >
                <Card style={{ width: '15rem', margin: "1%", color: "whitesmoke", backgroundColor: "#a60726" }} >
                  <Card.Body>
                    <Card.Title>1.</Card.Title>
                    <Card.Text>
                      Identify and acknowledge the citizen’s vulnerable situation
              </Card.Text>
                  </Card.Body>
                </Card>
                <Card style={{ width: '15rem', margin: "1%", color: "whitesmoke", backgroundColor: "#a60726" }}>
                  <Card.Body>
                    <Card.Title>2.</Card.Title>
                    <Card.Text>
                      Determine whether they are eligible for Government support
              </Card.Text>
                  </Card.Body>
                </Card>
                <Card style={{ width: '15rem', margin: "1%", color: "whitesmoke", backgroundColor: "#a60726" }}>
                  <Card.Body>
                    <Card.Title>3.</Card.Title>
                    <Card.Text>
                      Explore additional support structures to help the citizen mitigate their vulnerability
              </Card.Text>
                  </Card.Body>
                </Card>
                <Card style={{ width: '15rem', margin: "1%", color: "whitesmoke", backgroundColor: "#a60726" }}>
                  <Card.Body>
                    <Card.Title>4.</Card.Title>
                    <Card.Text>
                      Finally, offer the citizen access to financial products and services
              </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <CustomButton type="submit" onClick={this.handleStart} data={litrals.buttons.startButton}></CustomButton>
            </div>

            :

            <Form>
              <legend className="legend">{this.state.data.answer}</legend>
              {this.state.msg ? <h5 className={classes.error}>*Please select an option</h5> : null}
              {radios ? radios : ""}
              <CustomButton type="submit" onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton>
            </Form>}
        </div>

        {/* 
        <div style={{ display: (this.state.toggle == 2 ? "block" : "none") }} >

          <h1 className={classes.headingH1}>Thanks for using Covid 19 supporter tool! Please Visit again for any assistance.</h1>
          <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.back}></CustomButton>

        </div> */}

      </div>

    );
  }
}

export default WelcomePage;