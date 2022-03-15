import React from 'react'
import './CustomInput.scss';

const CustomInput = (props) => {
    return (

        <div className='selectWrap'>
                
                
                <input 
                    type={props.type}
                    onInput={props.onClick}
                    id={props.id} 
                    name= {props.name}
                    maxlength="2"
                />
                    
               
        </div>
    )
}


export default CustomInput;