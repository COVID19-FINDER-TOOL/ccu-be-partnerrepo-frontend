import React from 'react'
import './CustomRadio.css';

const CustomRadio = (props) => {
    return (
        <div className='radioWrap' onChange={props.onClick}>
            <label htmlFor={props.id} className="radio">
                <input className='radio_input' type="radio" value={props.radioLabel} key={props.id} id={props.id} name="radio-group" defaultChecked={props.checked}/>
                <div className="radio_radio"></div>
                <span className="label">{props.radioLabel}</span>
            </label>
        </div>
    )
}

export default CustomRadio;