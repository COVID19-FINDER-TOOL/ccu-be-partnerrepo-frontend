import React from 'react'
import './CustomRadio.scss';

const CustomRadio = (props) => {
    return (
        
        <div className='radioWrap' onChange={props.onClick}>
            <label htmlFor={props.id} className="containerr" style={{ display:props.display?"block":"none", width:props.width?props.width:"unset",float:props.margin?"right":"", marginTop:props.margin?"1rem":"", color: props.margin?"#F07D29":"", padding:props.margin?"12px":""}}>
                <input className='radio_input' type="radio" value={props.radioLabel} key={props.id} name = {props.name} id={props.id} defaultChecked={props.checked}/>
                <span className="label">{props.radioLabel}</span>
            </label>
        </div>
    )
}

export default CustomRadio;