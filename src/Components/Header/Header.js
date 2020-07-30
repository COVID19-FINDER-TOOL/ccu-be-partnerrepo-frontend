import React from "react";
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import classes from "./Header.module.css";
import { useParams } from "react-router-dom";
const Header = (props) => {
    const { id } = useParams();
    // console.log(props,id)
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
                        <Nav.Link bsPrefix={classes.linkElement} href="">Details</Nav.Link> 
                        <Nav.Link bsPrefix={classes.linkElement} href="">Link</Nav.Link> 
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            </Container>
            <div className={classes.caption}>
                <Container > <p className={classes.captionText}><u>Covid 19 Support Finder</u> / Personal Information</p> </Container>

            </div>
        </div>
    );
}

export default Header;