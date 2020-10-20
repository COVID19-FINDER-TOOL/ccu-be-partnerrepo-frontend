import React from 'react'
import classes from './CustomButton.module.scss';

const CustomButton =  (props)=>{
  return(
  <input type={"button"}  onClick={props.onClick} className={classes.buttonColor1} 
  style={{width:props.width,borderStyle:'none',display:props.disabled?"none":"block",margin:props.margin, float:props.float}} tabIndex={props.data.tabindex}  
  variant={props.data.variant} id={props.Id} key={props.key} name={props.name} size={props.data.size} disabled={props.disabled?props.disabled:props.data.disabled} autoFocus={props.data.autoFocus} value= {props.data.buttonText=="Action Plan"?"Next":props.data.buttonText}></input> 
  )
}

export default CustomButton;