import React from "react";
import { useState } from "react";
import classes from "./Warning.module.scss";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { axiosInstance, axiosLoginInstance } from "../../AxiosHandler";
const Warning = (props) => {
    return(
            <>
              <ConfirmationModal
                showModal={props.show}
                // onClick={handleSubmit}
                // onHide={hideModal}
                message={"Are you sure you want to continue? You have not sent your member their support options."}
              />
              
              <i
                title={"Warning"}
                className={"far fa-envelope " + classes.icon}
                // onClick={handleClick}
              ></i>
            </>
          
    )
};

export default Warning;