import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import classes from "./Header.module.scss";
import litrals from '../Litrals/Litrals';
import CustomButton from "../CustomButton/CustomButton";
import { surveyData } from "../../store/Action/SurveyAction";
import { onEditInspection, login } from "../../store/Action/LoginAction";
import { connect } from "react-redux";
import FloatingButton from '../FloatingButton/FloatingButton';

const heading = {
    "0": "Breathe Easy",
    "1": "Breathe Easy",
    "2": "Breathe Easy",
    "3": "Breathe Easy",
    "4": "Breathe Easy",
    "5": "Breathe Easy",
    "7": "Feedback",
    "8": "Breathe Easy"
}

const Header = (props) => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    return (
        <div className={classes.Header}>
            
                {mobile ?
                    <Container className={classes.mobileHeading}>
                        <Row>
                            <Col sm={12} xs={12} className={classes.brandImage}>
                                <p className={classes.brand}>{props.heading != undefined ? heading[props.heading] : "Welcome"}</p>
                            </Col>
                        </Row>
                        <Row style={{ width: "100%", paddingBottom: "10px" }}>
                            <Col sm={6} xs={6} style={{ margin: "auto" }}>
                                {props.heading && props.showBack ? <CustomButton float={"left"} type="submit" onClick={props.loading ? console.log("Loading") : props.handleBack} data={litrals.buttons.backNav}></CustomButton> : ""}
                            </Col>
                            {props.heading !== undefined && props.heading != "5" ?
                                <Col sm={"auto"} xs={6} style={{ margin: "auto" }}>
                                    {props.heading < 2 ? <CustomButton type="submit" float={"right"} onClick={props.loading ? console.log("Loading") : props.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : props.CustomButton ? <CustomButton type="submit" float={"right"} onClick={props.CustomButton} data={litrals.buttons.nextStep}></CustomButton> : props.dynamicOptions && props.dynamicOptions.length == 1 ? props.dynamicOptions : ""}
                                </Col>
                                : ""}
                        </Row>
                    </Container> :
                    
                        <>
                            <div className={classes.brandImage}>
                                <h3 className={classes.brand}>{props.heading != undefined ? heading[props.heading] : "Welcome"}</h3>
                            </div>
                            {/* <div className={classes.shareButton}>
                                <FloatingButton isOpen={true}></FloatingButton>
                            </div> */}

                        </>
                    }
            
        </div>
    );
}

const mapStateToProps = state => {
    return { payload: state.surveyData };
};

const mapDispatchToProps = dispatch => {
    return {
        onEditInspection: data => dispatch(onEditInspection(data)),
        login: data => dispatch(login(data)),
        surveyData: data => dispatch(surveyData(data))
    };
};

const HeaderData = connect(mapStateToProps, mapDispatchToProps)(Header);


export default HeaderData;

