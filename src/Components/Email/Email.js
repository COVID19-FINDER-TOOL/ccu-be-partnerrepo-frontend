import React from "react";
import { useState } from "react";
import classes from "./Email.module.scss";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { axiosInstance, axiosLoginInstance } from "../../AxiosHandler";

const Email = (props) => {
  const [showModal, setshowModal] = useState(false);
  const [email, setemail] = useState("");
  const [validEmail, setvalidEmail] = useState(true);

  const handleClick = () => {
    setshowModal(() => true);
  };

  const hideModal = () => {
    setshowModal(() => false);
    setvalidEmail(() => true);
  };

  const handleEmail = (e) => {
    setemail(() => e.target.value);
  };

  const validateEmail = () => {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    const emails = email.split(";")

    if (!emails.every(x => re.test(x.trim()))) {
      setvalidEmail(() => false);
    } else {
      setvalidEmail(() => true);
    }
  };
  const handleSubmit = () => {
    props.emailData.map((x)=>{
    const body = {
      "rights": x.rights,
      "actionPlan" : x.actionPlan,
      "email": email,
      "index": x.index,
      "flow":x.flow
    };

    console.log(x, body)
    validEmail &&
      email &&
      axiosLoginInstance.post("CFTSendEmailTrigger/", body).then(
        hideModal()).catch(hideModal());
        props.handleWarning()
      
  })
  };

  const emailInput = (
    <div>
      <input
        type="email"
        placeholder="Email"
        className={classes.emailInput}
        value={email}
        onChange={handleEmail}
        onBlur={validateEmail}
      />
      {!validEmail && (
        <p className={classes.error}>Please enter a valid email address.</p>
      )}
    </div>
  );

  return (
    <>
      <ConfirmationModal
        modalFooter="dualButton"
        formattedMsg={emailInput}
        showModal={showModal}
        onClick={handleSubmit}
        onHide={hideModal}
      />
      <i
        title={"Send as email"}
        className={"far fa-envelope " + classes.icon}
        onClick={handleClick}
      ></i>
    </>
  );
};

export default Email;
