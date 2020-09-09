import React from "react";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
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

const useStyles = makeStyles((theme) => ({
    root: {
        '& > span': {
            margin: theme.spacing(2),
            fill: "red"
        },
    },
}));

const heading = {
    "0": "Tell us about yourself",
    "1": "Tell us about yourself",
    "2": "View Your Options",
    "3": "Know Your Rights",
    "4": "Review your action plan",
    "5": "Hear from others",
    "7":"Feedback"
}

const Header = (props) => {
    const muiclasses = useStyles();
    return (
        <div className={classes.Header}>
            <Navbar variant="light" style={{padding:"0%"}}>
                <Navbar.Brand href="" bsPrefix={classes.brandImage}>
                    
                    <p className={classes.brand}>{props.heading ? heading[props.heading] : "Welcome"}</p>

                </Navbar.Brand>
                
               

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
                    <Nav className={classes.links}>
                        <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><WhatsappShareButton title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton ></Nav.Link></div>
                        <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><EmailShareButton subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton></Nav.Link></div>

                    </Nav>
                
            </Navbar>
        </div>
    );
}

export default Header;