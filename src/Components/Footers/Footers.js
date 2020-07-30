import React from "react";
import classes from "./Footers.module.css";
import { Row, Container, Nav } from "react-bootstrap";

const Footers = props => {
    return (
        <div className={classes.footers}>
            <Row className={classes.footer1}>
                <Container>
                    <Nav>
                        <Nav.Link bsPrefix={classes.footer1Links} href="">Details</Nav.Link>
                        <Nav.Link bsPrefix={classes.footer1Links} href="">Link Here</Nav.Link>
                    </Nav>
                </Container>
            </Row>
            <Row className={classes.footer2Row}>
                <p className={classes.footer2}>© SopraSteria 2020</p>
            </Row>
        </div>
    );
}
export default Footers;