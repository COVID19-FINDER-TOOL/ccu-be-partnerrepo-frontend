import React from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import classes from "./Header.module.scss";
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
                    <Navbar.Brand href="" bsPrefix={classes.brandImage}>
                        <img
                            alt="SSlogo"
                            src={require("../../assets/Images/logoSmall.png")}
                            width="50"
                        />
                    <p className={classes.brand}>Support Finder</p>

                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className={classes.links}>
                            <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><WhatsappShareButton title = 'Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon fontSize="large" className={classes.linkElement}></WhatsAppIcon></WhatsappShareButton ></Nav.Link></div>
                            <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}><EmailShareButton  subject = 'Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton></Nav.Link></div>
                            
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
            {/* <div className={classes.caption}>
                <Container > <p className={classes.captionText}><u>Covid 19 Support Finder</u></p> </Container>

            </div> */}
        </div>
    );
}

export default Header;