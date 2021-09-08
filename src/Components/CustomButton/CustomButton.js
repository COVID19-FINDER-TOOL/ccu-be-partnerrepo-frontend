import React from "react";
import classes from "./CustomButton.module.scss";

const CustomButton = (props) => {
  return (
    <button
      type={"button"}
      onClick={props.onClick}
      className={ props.data.buttonText === "Back" || props.data.buttonText === "Not happy to proceed" || props.data.buttonText === "No" ? classes.buttonColorBack : classes.buttonColor1}
      style={{
        width: props.width,
        borderStyle: "none",
        display: props.disabled ? "none" : "block",
        margin: props.margin,
        float: props.float,
      }}
      tabIndex={props.data.tabindex}
      variant={props.data.variant}
      id={props.Id}
      key={props.keys}
      name={props.name}
      size={props.data.size}
      disabled={props.disabled ? props.disabled : props.data.disabled}
      autoFocus={props.data.autoFocus}
      value={
        props.data.buttonText == "Action Plan" ? "Next" : props.data.buttonText
      }
    >
      { props.data.buttonText === "No" ? <i style={{marginRight:"10px"}} className="fas fa-chevron-left"></i> : null}
      { props.data.buttonText === "Back"? <i style={{marginRight:"10px"}} className="fas fa-chevron-left"></i> : null}
      {props.data.buttonText == "Action Plan" || props.data.buttonText == "ActionPlan" ? "Next" : props.data.buttonText}
      { props.data.buttonText !== "Back"  && props.data.buttonText !== "No" ? <i style={{marginLeft:"10px"}} className="fas fa-chevron-right"></i> : null}
    </button>
  );
};

export default CustomButton;
