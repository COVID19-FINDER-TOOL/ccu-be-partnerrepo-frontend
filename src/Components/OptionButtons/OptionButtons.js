import React, { useState } from 'react'
import classes from './OptionButtons.module.scss';
import { Row, Col } from 'react-bootstrap';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
class OptionButtons extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            textObj : {
                0 : false,
                1 : false,
                2 : false,
                3 : false,
                4 : false,
                5 : false
            }
        }
    }

    changeTextOnClick = (event) =>{
        const id = event.target.id
        var temp = {...this.state.textObj}
        temp[id] = !temp[id]
            this.setState(()=>{return{textObj:temp}})
        console.log(this.state,id,event.target)
        
    }
    render(){
    const options = this.props.array.map((x,index) => {
        return (
            <div className={classes.container} value={x.displayText} onClick={this.changeTextOnClick} id={index}>
                {this.props.partition ? <Row id={index} onClick={this.changeTextOnClick}>
                    <Col md = {2} sm={2} id={index} onClick={this.changeTextOnClick} xs={2} className={classes.index}><FormatListBulletedIcon onClick={this.changeTextOnClick} style={{ margin: "15px", fontSize: "3rem" }} className={classes.listIcon}></FormatListBulletedIcon></Col>
                    <Col md = {10} sm={10} onClick={this.changeTextOnClick} xs={10} id={index} className={classes.textContainer} ><p id={index} onClick={this.changeTextOnClick} className={classes.text}>{this.state.textObj[index] ==true ? x.displayText : x.pretext}</p></Col>
                </Row> : <p  onClick={this.changeTextOnClick} className={classes.text}>{x.displayText}</p>}
            </div>
        )
    })
    return(options)
    }
}
export default OptionButtons;