import React from "react";
import classes from "./Footers.module.scss";
import { Row, Container, Nav } from "react-bootstrap";

const Footers = props => {
    return (
        <div className={classes.footers}>

            <Nav>
                <Nav.Link bsPrefix={classes.footer1Links} href="">Privacy Policy</Nav.Link>
                <Nav.Link bsPrefix={classes.footer1Links} href="">About us</Nav.Link>
                <Nav.Link bsPrefix={classes.footer1Links} href="">Terms and Conditions</Nav.Link>
            </Nav>

        </div>
    );
}
export default Footers;