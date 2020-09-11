import React from "react";
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap';
import classes from "./Header.module.scss";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { makeStyles } from '@material-ui/core/styles';
import ShareSharpIcon from '@material-ui/icons/ShareSharp';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import {
    EmailShareButton,
    WhatsappShareButton,

} from "react-share";
import { axiosLoginInstance } from '../../AxiosHandler';


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
    return (
        <div className={classes.Header}>
            <Navbar variant="light" style={{ padding: "0%" }}>

                <Row style={{ width: "100%", paddingTop: "1%" }}>
                    <Col md={1}>BACK</Col>
                    <Col md={9} className={classes.brandImage}>
                        <p className={classes.brand}>{props.heading ? heading[props.heading] : "Welcome"}</p>
                    </Col>
                    <Col md={1}>

                        <DropdownButton id="dropdown-item-button" title='Share' bsPrefix={classes.links}>
                            <Dropdown.Item as="div" id={"whatsapp"} onClick={sendShareInfo}><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"}  className={classes.linkElement}><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton >WhatsApp</span></div></Dropdown.Item>
                            <Dropdown.Item as="div" id={"email"} onClick={sendShareInfo}><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>Email</span></div></Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col md={1}>NEXT</Col>

                </Row>
            </Navbar>
        </div>
    );
}

export default Header;