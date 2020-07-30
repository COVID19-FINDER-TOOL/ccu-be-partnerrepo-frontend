import React from 'react'
import classes from './WelcomePage.module.css';
import { Form } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';


const WelcomePage =  (props)=>{
  return(
    <div >
        <h1 className={classes.headingH1}>Welcome to Covid-19 Support Finder</h1>
        <p className={classes.para}>The government, charities and community groups are offering financial and emotional support during the Covid-19 pandemic. Make sure you are aware what you are entitled to before applying for credit.</p>
        <Form>
            <legend className="legend">Do you accept our Terms and Conditions?</legend>
            <CustomRadio radioLabel="Yes" id={1} ></CustomRadio>
            <CustomRadio radioLabel="No" id={2}></CustomRadio>
            <CustomButton data={litrals.buttons.nextStep}></CustomButton>
        </Form>
    </div>
  )
}

export default WelcomePage;