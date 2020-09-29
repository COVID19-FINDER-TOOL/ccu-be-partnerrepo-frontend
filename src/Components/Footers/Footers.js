import React from "react";
import classes from "./Footers.module.scss";
import { Row, Container, Nav } from "react-bootstrap";

const Footers = props => {
    return (
        <div className={classes.footers}>

            <Nav>
                <Container>
                <Nav.Link bsPrefix={classes.footerLinks} href="">Privacy Policy</Nav.Link>
                <Nav.Link bsPrefix={classes.footerLinks} href="">About us</Nav.Link>
                <Nav.Link bsPrefix={classes.footerLinks} href="">Terms and Conditions</Nav.Link>
                </Container>
            </Nav>

        </div>
    );
}
export default Footers;