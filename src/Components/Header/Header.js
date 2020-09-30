import React from "react";
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap';
import classes from "./Header.module.scss";
import litrals from '../Litrals/Litrals';
import CustomButton from "../CustomButton/CustomButton";
import { surveyData } from "../../store/Action/SurveyAction";
import { onEditInspection, login } from "../../store/Action/LoginAction";
import { connect } from "react-redux";
import FloatingButton from '../FloatingButton/FloatingButton';
import Tooltip from '@material-ui/core/Tooltip';

const heading = {
    "0": "Tell Us About Yourself",
    "1": "Tell Us About Yourself",
    "2": "View Your Options",
    "3": "View Your Options",
    "4": "Review Your Action Plan",
    "5": "Hear From Others",
    "7": "Feedback",
    "8": "How Does It Work?"
}

const Header = (props) => {
    // console.log(props.heading)
    const navBack = () => {

        props.heading == 7 ? props.history.push('/chatbot') : props.history.push('/')
    }
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    return (
        <div className={classes.Header}>
            <Navbar variant="light" style={{ padding: "0%" }}>
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
                    <Container>
                        <Row style={{ width: "100%", paddingTop: "10px" }}>
                            <Col md={"auto"}>
                            <Tooltip disableFocusListener title="Home" arrow placement="left">
                                <p className={classes.logoPara} onClick={props.showHomeModal}>
                                    <img
                                        alt="SSlogo"
                                        src={require("../../assets/Images/Support_finder_logo.png")}
                                        width="45"
                                        style={{ marginRight: "1.2rem", cursor: "pointer" }}
                                    />Support Finder
                                </p>
                            </Tooltip>
                            </Col>
                            <Col md={6} sm={6} className={classes.brandImage}>
                                <p className={classes.brand}>{props.heading != undefined ? heading[props.heading] : "Welcome"}</p>
                            </Col>
                            <Col md={"auto"} sm={"auto"} style={{marginLeft:'auto'}}>
                                <FloatingButton isOpen={true}></FloatingButton>
                            </Col>

                        </Row>
                    </Container>}
            </Navbar>
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

