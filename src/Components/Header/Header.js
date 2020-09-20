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
import { onEditInspection, login } from "../../store/Action/LoginAction";
import { connect } from "react-redux";
import moment from "moment";


const heading = {
    "0": "Tell us about yourself",
    "1": "Tell us about yourself",
    "2": "View Your Options",
    "3": "Know Your Rights",
    "4": "Review your action plan",
    "5": "Hear from others",
    "7": "Feedback"
}

const setUser = (user) => {
    axiosLoginInstance.post("CFTUserIdTrigger/user", user)
        .then(res => {
            
            window.localStorage.setItem('csf_user', JSON.stringify(user));

        }).catch(error => {
            console.log(error);
        });
}

const sendShareInfo = (event) => {
    console.log(event.target)
    var user = JSON.parse(window.localStorage.getItem("csf_user"))

    if (!user) {
        user = {
            user_id: "UID" + moment.utc().format('DDMMYYThhmmssSSS'),
            creation_time: moment.utc().format('YYYY-MM-DD hh:mm:ss')
        }
        setUser(user)
    }

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
    // console.log(props.heading)
    const navBack = () => {

        props.heading == 7 ? props.history.push('/chatbot') : props.history.push('/')
    }
    const mobile = window.matchMedia("(max-width: 600px)").matches;

    return (
        <div className={classes.Header}>
            <Navbar variant="light" style={{ padding: "0%" }}>
                <Container>
                    <Row style={{ width: "100%", paddingTop: "5px" }}>
                        <Col md={2} sm={2} xs={4} style={{ margin: "auto" }}>
                            {props.heading && props.showBack ? <CustomButton float={"left"} type="submit" onClick={props.handleBack} data={litrals.buttons.backNav}></CustomButton> : ""}</Col>
                        <Col md={6} sm={6} xs={4} className={classes.brandImage}>
                            <p className={classes.brand}>{props.heading != undefined ? heading[props.heading] : "Welcome"}</p>
                        </Col>
                        {mobile ? "" : <Col md={"auto"} sm={"auto"} xs={2} style={{ marginLeft: "auto" }}>

                            <DropdownButton id="dropdown-item-button" title='Share' bsPrefix={classes.links}>
                                <Dropdown.Item as="div" id={"whatsapp"} onClick={sendShareInfo}><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon>WhatsApp</span></div></WhatsappShareButton></Dropdown.Item>
                                <Dropdown.Item as="div" id={"email"} onClick={sendShareInfo}><EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon>Email</span></div></EmailShareButton></Dropdown.Item>
                            </DropdownButton>
                        </Col>}
                        {props.heading !== undefined && props.heading != "5" ?
                            <Col md={"auto"} sm={"auto"} xs={4} style={{ margin: "auto" }}>
                                {props.heading < 2 ? <CustomButton type="submit" float={"right"} onClick={props.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : props.CustomButton ? <CustomButton type="submit" float={"right"} onClick={props.CustomButton} data={litrals.buttons.nextStep}></CustomButton> : props.dynamicOptions && props.dynamicOptions.length == 1 ? props.dynamicOptions : ""}</Col>
                            : ""}
                    </Row>
                </Container>
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

