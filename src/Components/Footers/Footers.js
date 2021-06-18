import React from "react";
import classes from "./Footers.module.scss";
import { Container, Nav } from "react-bootstrap";
import litrals from "../Litrals/Litrals";


const creatLinks = () => {
  return (
    <>
      <Nav.Link bsPrefix={classes.footerLinks} href="">
        Privacy Policy
      </Nav.Link>
      <Nav.Link bsPrefix={classes.footerLinks} href="">
        About us
      </Nav.Link>
      <Nav.Link bsPrefix={classes.footerLinks} href="">
        Terms and Conditions
      </Nav.Link>
    </>
  );
};

const Footers = (props) => {
  console.log(props);

  return (
    <div className={classes.footers}>
      <div className={classes.aligner}>
        <div className={classes.images}>
          <img
            className={classes.logoImage}
            src={require("../../assets/Images/Image 8.png")}
            alt="SS logo"
          ></img>
          <img
            className={classes.logoImage}
            src={require("../../assets/Images/Image 7.png")}
            alt="university logo"
          ></img>
        </div>
        <div className={ props.format ? classes.links : classes.citation}>
          {props.format ? creatLinks() : <p>{litrals.welcome.text2}</p>}
        </div>
      </div>
      {props.format ? (
        <div className={classes.buttons}>
          {props.buttonpanel}
        </div>
      ) : null}
    </div>
  );
};
export default Footers;
