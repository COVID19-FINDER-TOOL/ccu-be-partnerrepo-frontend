import React from "react";
import classes from "./Footers.module.scss";
import { Container, Nav } from "react-bootstrap";
import litrals from "../Litrals/Litrals";


const creatLinks = () => {
  return (
    <>
      <Nav.Link
        bsPrefix={classes.footerLinks}
        href="PrivacyPolicy"
        target="_blanck"
      >
        Privacy Policy</Nav.Link>
      <Nav.Link
        bsPrefix={classes.footerLinks}
        href="https://www.soprasteria.com/about-us"
        target="_blanck"
      >
        About us
      </Nav.Link>
      <Nav.Link
        bsPrefix={classes.footerLinks}
        href="https://www.soprasteria.com/footer/terms-of-use"
        target="_blanck"
      >
        Terms and Conditions
      </Nav.Link>
    </>
  );
};

const Footers = (props) => {
  
  const img1 = process.env.FOOTER_IMAGE_1;
  const img2 = process.env.FOOTER_IMAGE_2;

  console.log('sachin => ',props.navigation)
  return (
    <div className={classes.footers}>
      <div className={classes.aligner}>
        <div className={classes.images}>
          <img
            className={classes.logoImage}
            src={require("../../assets/Images/Logo_Capital-Credit-Union.png").default}
            alt="SS logo"
          ></img>
          {img2 && <img
            className={classes.logoImage}
            src={require("../../assets/Images/"+img2).default}
            alt="university logo"
          ></img>}
        </div>
        <div className={ props.format ? classes.links : classes.citation}>
          {props.format ? creatLinks(props.history) : <p>{litrals.welcome.text2}</p>}
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
