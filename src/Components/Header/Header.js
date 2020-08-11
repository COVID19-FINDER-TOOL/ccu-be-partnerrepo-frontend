import React from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import classes from "./Header.module.css";
import { makeStyles } from '@material-ui/core/styles';
import ShareSharpIcon from '@material-ui/icons/ShareSharp';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > span': {
        margin: theme.spacing(2),
        fill:"red"
      },
    },
  }));

const Header = (props) => {
    const muiclasses = useStyles();
    return (
        <div>
            <Container style={{paddingTop:"0.5%"}}>
            <Navbar collapseOnSelect variant="light" expand="lg">
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
                        <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}>Share<ShareSharpIcon  fontSize="large" style={{fill:"#a60726"}}></ShareSharpIcon></Nav.Link></div>
                        <div className={classes.iconsbar}><Nav.Link bsPrefix={classes.linkElement}>Invite<AddToQueueIcon  fontSize="large" style={{fill:"#a60726"}}></AddToQueueIcon></Nav.Link></div>
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