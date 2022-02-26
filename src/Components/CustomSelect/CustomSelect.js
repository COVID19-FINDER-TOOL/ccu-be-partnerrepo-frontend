import React from 'react'
import './CustomSelect.scss';

const CustomSelect = (props) => {
    return (

        <div className='selectWrap'>
                
                
                <select
                    onChange={props.onClick}
                    value={props.firstOption}
                    id={props.id} 
                    key={props.id} 
                >
                    
                    <option>Select Option</option>
                    {props.optionValue?.map((x) => {
                               return <option key={x.id}  id={x.id} value={x.value}>{x.value}</option>

                            })
                       }
                    
                </select>
        </div>
    )
}


export default CustomSelect;