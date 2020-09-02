import React, { useState } from 'react'
import classes from './OptionButtons.module.scss';
import { Row, Col } from 'react-bootstrap';

class OptionButtons extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            textArray : [false,false,false,false,false]
        }
    }

    changeTextOnClick = (event) =>{
        const id = event.target.id
        var temp = [...this.state.textArray]
        temp[id] = !temp[id]
        this.setState({textArray:temp})
        console.log(this.state,id,event.target)
        
    }
    render(){
    const options = this.props.array.map((x,index) => {
        return (
            <div className={classes.container} onClick={this.props.onClick} value={x.displayText} onClick={this.changeTextOnClick} id={index}>
                {this.props.partition ? <Row>
                    <Col xs={2} className={classes.index}><p>{index+1}</p></Col>
                    <Col xs={10} id={index} ><p className={classes.text}>{this.state.textArray[index] ==true ? x.displayText : x.pretext}</p></Col>
                </Row> : <p className={classes.text}>{x.displayText}</p>}
            </div>
        )
    })
    return(options)
    }
}
export default OptionButtons;