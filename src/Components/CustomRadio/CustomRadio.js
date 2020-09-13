import React from 'react'
import './CustomRadio.scss';

const CustomRadio = (props) => {
    return (
        
        <div className='radioWrap' onChange={props.onClick}>
            <label htmlFor={props.id} className={props.btn ? " displayAsButton" : "containerr"} style={{ display:props.display?"block":"none", width:props.width?props.width:"unset"}}>
                <input className='radio_input' type="radio" value={props.radioLabel} key={props.id} name = {props.name} id={props.id} defaultChecked={props.checked}/>
                <span className="label">{props.radioLabel}</span>
            </label>
        </div>
    )
}

export default CustomRadio;