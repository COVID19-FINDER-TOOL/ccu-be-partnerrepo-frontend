import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import {
    FloatingMenu,
    MainButton,
    ChildButton,
} from 'react-floating-button-menu';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import {
    EmailShareButton,
    WhatsappShareButton,

} from "react-share";
import ShareIcon from '@material-ui/icons/Share';
import MdClose from '@material-ui/icons/Clear';
import classes from './FloatingButton.module.scss';
import { axiosLoginInstance } from '../../AxiosHandler';
import { surveyData } from "../../store/Action/SurveyAction";
import { onEditInspection, login } from "../../store/Action/LoginAction";
import { connect } from "react-redux";
import moment from "moment";

const setUser = (user) => {
    axiosLoginInstance.post("CFTUserIdTrigger/user", user)
        .then(res => {

            window.localStorage.setItem('csf_user', JSON.stringify(user));

        }).catch(error => {
            console.log(error);
        });
}

const sendShareInfo = (event) => {
    console.log(event.target)
    var user = JSON.parse(window.localStorage.getItem("csf_user"))

    if (!user) {
        user = {
            user_id: "UID" + moment.utc().format('DDMMYYThhmmssSSS'),
            creation_time: moment.utc().format('YYYY-MM-DD hh:mm:ss')
        }
        setUser(user)
    }

    const medium = event.target.id
    const body = {
        "user_id": user.user_id,
        "medium": medium
    }
    axiosLoginInstance.post("CFTUserShareTrigger/invite", body)
        .then(res => {
            const data = res.data;
            console.log(data);
        }).catch(error => {
            console.log(error);
        });
}

const FloatingButton = (props) => {

    const [isOpen, setIsOpen] = useState(false)
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    return (
        <>
            {mobile ?
                <FloatingMenu
                    slideSpeed={500}
                    direction="up"
                    spacing={8}
                    isOpen={isOpen}
                >
                    <MainButton
                        iconResting={<ShareIcon style={{ fontSize: 25 }} className={classes.shareButton} />}
                        iconActive={<MdClose style={{ fontSize: 20 }} />}
                        onClick={() => setIsOpen(!isOpen)}
                        size={50}
                        style={{ backgroundColor: "white" }}

                    />
                    <ChildButton
                        icon={<WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://breatheasysupport.z13.web.core.windows.net"} ><WhatsAppIcon onClick={sendShareInfo} id={"whatsapp"} fontSize="large" className={classes.linkElement} ></WhatsAppIcon></WhatsappShareButton>}
                        size={35}
                        className={classes.backgroundColor}
                        id={"whatsapp"}
                    />
                    <ChildButton
                        icon={<EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://breatheasysupport.z13.web.core.windows.net"}><MailIcon onClick={sendShareInfo} id={"email"} fontSize="large" className={classes.linkElement} ></MailIcon></EmailShareButton>}
                        size={35}
                        className={classes.backgroundColor}
                        id={"email"}
                    />
                </FloatingMenu>
                :
                <div>
                    <DropdownButton id="dropdown-item-button" title='Share' bsPrefix={classes.links}>
                        <Dropdown.Item as="div" id={"whatsapp"} onClick={sendShareInfo}><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://breatheasysupport.z13.web.core.windows.net"} ><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}> </WhatsAppIcon>WhatsApp</WhatsappShareButton ></span></div></Dropdown.Item>
                        <Dropdown.Item as="div" id={"email"} onClick={sendShareInfo}><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://breatheasysupport.z13.web.core.windows.net"}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon>Email</EmailShareButton></span></div></Dropdown.Item>
                    </DropdownButton>

                </div>
            }
        </>
    )
}

const mapStateToProps = state => {
    return { payload: state.surveyData };
};

const mapDispatchToProps = dispatch => {
    return {
        onEditInspection: data => dispatch(onEditInspection(data)),
        login: data => dispatch(login(data)),
        surveyData: data => dispatch(surveyData(data))
    };
};

const FloatingBottonData = connect(mapStateToProps, mapDispatchToProps)(FloatingButton);


export default FloatingBottonData;