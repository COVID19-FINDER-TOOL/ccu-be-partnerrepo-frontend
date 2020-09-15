import React from "react";
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap';
import classes from "./Header.module.scss";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import litrals from '../Litrals/Litrals';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import {
    EmailShareButton,
    WhatsappShareButton,

} from "react-share";
import { axiosLoginInstance } from '../../AxiosHandler';
import CustomButton from "../CustomButton/CustomButton";
import { surveyData } from "../../store/Action/SurveyAction";
import { onEditInspection } from "../../store/Action/LoginAction";
import { connect } from "react-redux";


const heading = {
    "0": "Tell us about yourself",
    "1": "Tell us about yourself",
    "2": "View Your Options",
    "3": "Know Your Rights",
    "4": "Review your action plan",
    "5": "Hear from others",
    "7": "Feedback"
}

const sendShareInfo = (event) => {
    console.log(event.target)
    const user = JSON.parse(window.localStorage.getItem("csf_user"))
    const medium = event.target.id
    const body = {
        "user_id": user.user_id,
        "medium": medium
    }
    axiosLoginInstance.post("CFTUserShareTrigger/invite", body)
        .then(res => {
            const data = res.data;
            console.log(data);
        }).catch(error => {
            console.log(error);
        });
}



const Header = (props) => {
    console.log(props.CustomButton);
    
    const navBack = () =>{
        props.heading == 7 ? props.history.push("/chatbot") : props.history.push("/");
    }
    const mobile = window.matchMedia("(max-width: 600px)").matches;

    return (
        <div className={classes.Header}>
            <Navbar variant="light" style={{ padding: "0%" }}>

                <Row style={{ width: "100%", paddingTop: "5px" }}>
                    <Col md={2} sm={2} xs={3} style={{marginLeft:"15px"}}>
                        <CustomButton float={"left"} type="submit" onClick={ props.showBack && props.heading>0 ? props.handleBack : navBack} data={litrals.buttons.backNav}></CustomButton></Col>
                    <Col md={6} sm={6} xs={5} className={classes.brandImage}>
                        <p className={classes.brand}>{props.heading ? heading[props.heading] : "Welcome"}</p>
                    </Col>
                    { mobile ?"": <Col md={1} sm={1} xs={2}>

                        <DropdownButton id="dropdown-item-button" title='Share' bsPrefix={classes.links}>
                            <Dropdown.Item as="div" id={"whatsapp"} onClick={sendShareInfo}><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"}  className={classes.linkElement}><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton >WhatsApp</span></div></Dropdown.Item>
                            <Dropdown.Item as="div" id={"email"} onClick={sendShareInfo}><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>Email</span></div></Dropdown.Item>
                        </DropdownButton>
                    </Col>}
                    <Col md={2} sm={2}  xs={3}> 
                    { props.heading <2 ? <CustomButton type="submit" float={"right"} onClick={props.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> :  props.CustomButton ? <CustomButton type="submit" float={"right"} onClick={props.CustomButton} data={litrals.buttons.nextStep}></CustomButton> : props.dynamicOptions  && props.dynamicOptions.length == 1 ? props.dynamicOptions : 
                        ""
                    }</Col>

                </Row>
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
        surveyData: data => dispatch(surveyData(data))
    };
};

const HeaderData = connect(mapStateToProps, mapDispatchToProps)(Header);


export default HeaderData;

