import React, {useState, useEffect} from 'react'
import './CustomSelect.scss';
import Select from 'react-select'

const CustomSelect = (props) => {
    const [selectOption, setSelectOption] = useState([])

      useEffect(async () => {
        await getOptionData()
        setTimeout(() => {
            console.log(selectOption)

        }, 1000);
    }
    ,[]);

    const getOptionData = () => {
       
        let optionData = []
        props.optionValue?.forEach(async (element) => {
            
            let options = {
                label: element.value,
                value: element.id,
                selectId: props.id
            }
            optionData.push(options)
        });
        console.log('options', optionData)
         setSelectOption(() => optionData)

    }

    return (
        <div className='selectWrap'>
                {/* <select
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
                </select> */}

                <Select 
                    styles={customStyles}
                    options={selectOption} 
                    onChange={props.onClick}
                    value={props.firstOption}
                    id={props.id} 
                    width="50%"
                />
        </div>
    )
}


export default CustomSelect;

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }