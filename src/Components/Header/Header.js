import React from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import classes from "./Header.module.css";
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

const Header = (props) => {
    const muiclasses = useStyles();
    return (
        <div>
            <Container style={{ paddingTop: "0.5%" }}>
                <Navbar variant="light">
                    <Navbar.Brand href="">
                        <img
                            alt="SSlogo"
                            src={require("../../assets/Images/Sopra_Steria_logo.svg")}
                            width="200"
                            // height="30"
                            className="d-inline-block align-top"
                        />

                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className={classes.links}>
                            <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><WhatsappShareButton title = 'Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" style={{ fill: "#a60726" }}></WhatsAppIcon></WhatsappShareButton ></Nav.Link></div>
                            <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><EmailShareButton  subject = 'Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" style={{ fill: "#a60726" }}></MailIcon></EmailShareButton></Nav.Link></div>
                            
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
            <div className={classes.caption}>
                <Container > <p className={classes.captionText}><u>Covid 19 Support Finder</u></p> </Container>

            </div>
        </div>
    );
}

export default Header;