import React from 'react'
import './CustomRadio.scss';

const CustomRadio = (props) => {
    const removeRadioMark = props.section > 1 ? true : false;
    const type = props.isCheckBox ? "checkbox" : "radio"
    return (

        <div className='radioWrap' onChange={props.onClick}>
            <label htmlFor={props.id} className={props.btn ? " displayAsButton" : "containerr"} style={{ display: props.display ? "block" : "none", width: props.width ? props.width : "fit-content" }}>
                <input 
                className={props.ind==0 ?'checkbox_input' :'radio_input'} 
                type={type} 
                value={props.radioLabel} 
                key={props.id} 
                name={props.name} 
                id={props.id} 
                defaultChecked={props.checked ? true : false} />
                <span className={removeRadioMark ? props.radioLabel === "No" ? "labelwithoutRadioNo" : "labelwithoutRadioYes" : "label"}>{props.radioLabel}</span>
            </label>
        </div>
    )
}

export default CustomRadio;