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

const heading = {
    "0": "Tell us about yourself",
    "1": "Tell us about yourself",
    "2": "View Your Options",
    "3": "Know Your Rights",
    "4": "Review your action plan",
    "5": "Hear from others",
    "7": "Feedback"
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
                        <Dropdown.Item as="div"><div className={classes.iconsbar}><span bsPrefix={classes.linkElement}><WhatsappShareButton title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton >WhatsApp</span></div></Dropdown.Item>
                        <Dropdown.Item as="div"><div className={classes.iconsbar}><span bsPrefix={classes.linkElement}><EmailShareButton subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>Email</span></div></Dropdown.Item>
                    </DropdownButton>
                    </Col>
                    <Col md={1}>NEXT</Col>

                </Row>



                {/* <DropdownButton id="dropdown-item-button" title="Share" bsPrefix={classes.links}>
                        <Dropdown.Item as="div"><div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><WhatsappShareButton title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton ></Nav.Link></div></Dropdown.Item>
                        <Dropdown.Item as="div"><div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><EmailShareButton subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton></Nav.Link></div></Dropdown.Item>
                        {/* <Dropdown.Item as="div">Something else</Dropdown.Item> */}
                {/* </DropdownButton> */}
                {/* <NavDropdown title="Share">
                        <NavDropdown.Item><div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><WhatsappShareButton title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton ></Nav.Link></div></NavDropdown.Item>
                        <NavDropdown.Item><div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><EmailShareButton subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton></Nav.Link></div>
                        </NavDropdown.Item>
                    </NavDropdown> */}
                {/* <Nav className={classes.links}>
                        <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><WhatsappShareButton title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton ></Nav.Link></div>
                        <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><EmailShareButton subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton></Nav.Link></div>

                    </Nav> */}

            </Navbar>
        </div>
    );
}

export default Header;