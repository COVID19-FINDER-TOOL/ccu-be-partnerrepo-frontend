import React, { useState } from 'react';
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
    const mobile = window.matchMedia("(max-width: 600px)").matches;

    return (
        <FloatingMenu
            slideSpeed={500}
            direction="up"
            spacing={8}
            isOpen={isOpen}
        >
            <MainButton
                iconResting={<ShareIcon style={{ fontSize: mobile ? 25 : 30 }} className={classes.shareButton}/>}
                iconActive={<MdClose style={{ fontSize: mobile ? 20 : 25 }}/>}
                onClick={() => setIsOpen(!isOpen)}
                size={mobile ? 50 : 60}
                style={{backgroundColor:"white"}}
                
            />
            <ChildButton
                icon={<WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><WhatsAppIcon onClick={sendShareInfo} id={"whatsapp"} fontSize="large" className={classes.linkElement} ></WhatsAppIcon></WhatsappShareButton>}
                size={mobile ? 35 : 40}
                className={classes.backgroundColor}
                id = {"whatsapp"}
            />
            <ChildButton
                icon={<EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon  onClick={sendShareInfo} id={"email"} fontSize="large" className={classes.linkElement} ></MailIcon></EmailShareButton>}
                size={mobile ? 35 : 40}
                className={classes.backgroundColor}             
                id = {"email"} 
            />
        </FloatingMenu>
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