import React from 'react'
import './CustomRadio.scss';

const CustomRadio = (props) => {
    console.log(props.margin)
    return (
        
        <div className='radioWrap' onChange={props.onClick}>
            <label htmlFor={props.id} className="containerr" style={{width:props.width?props.width:"unset",margin:props.margin?"auto":"", marginTop:props.margin?"1rem":""}}>
                <input className='radio_input' type="radio" value={props.radioLabel} key={props.id} name = {props.name} id={props.id} defaultChecked={props.checked}/>
                {/* <div className="radio_radio"></div> */}
                <span className="label">{props.radioLabel}</span>
            </label>
        </div>
    )
}

export default CustomRadio;