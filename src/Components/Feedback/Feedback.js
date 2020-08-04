import React from 'react'
import classes from './Feedback.module.css';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
const Feedback = (props) => {
    return (
        <div>
            <h1 className={classes.headingH1}>Thanks for using Covid 19 supporter tool! Please Visit again for any assistance.</h1>
            <CustomButton type="submit" onClick={()=>{props.history.push('/')}} data={litrals.buttons.back}></CustomButton>
        </div>
    )
}

export default Feedback;