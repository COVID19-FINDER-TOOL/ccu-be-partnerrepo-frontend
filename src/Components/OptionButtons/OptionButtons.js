import React from 'react'
import classes from './OptionButtons.module.scss';
import { Row, Col } from 'react-bootstrap';

const OptionButtons = (props) => {
    const options = props.array.map((x,index) => {
        return (
            <div className={classes.container} onClick={props.onClick} value={x.displayText}>
                {props.partition ? <Row>
                    <Col xs={2} className={classes.index}><p>{index+1}</p></Col>
                    <Col xs={10}><p className={classes.text}>{x.displayText}</p></Col>
                </Row> : <p className={classes.text}>{x.displayText}</p>}
            </div>
        )
    })
    return(options)

}
export default OptionButtons;