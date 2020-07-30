import React from 'react'
import './CustomRadio.css';

const CustomRadio = (props) => {
    return (
        <div className='radioWrap'>
            <label htmlFor={props.id} className="radio">
                <input className='radio_input' type="radio" id={props.id} name="radio-group"/>
                <div className="radio_radio"></div>
                <span className="label">{props.radioLabel}</span>
            </label>
        </div>
    )
}

export default CustomRadio;