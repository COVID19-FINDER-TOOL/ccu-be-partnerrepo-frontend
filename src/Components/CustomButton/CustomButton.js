import React from 'react'
import classes from './CustomButton.module.css';
import {Button} from 'react-bootstrap' 



const CustomButton =  (props)=>{
  return(
  <Button onClick={props.onClick} className={classes.buttonColor1} 
  style={{width:props.width,borderStyle:'none',backgroundColor:props.disabled||props.data.disabled?'#b5b3b3':'',margin:props.margin}} tabIndex={props.data.tabindex}  
  variant={props.data.variant} size={props.data.size} type={props.data.type} disabled={props.disabled?props.disabled:props.data.disabled} autoFocus={props.data.autoFocus}> {props.data.buttonText}</Button> 
  )
}

export default CustomButton;