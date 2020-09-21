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


const FloatingButton = (props) => {

    const [isOpen, setIsOpen] = useState(false)
    return (
        <FloatingMenu
            slideSpeed={500}
            direction="up"
            spacing={8}
            isOpen={isOpen}
        >
            <MainButton
                iconResting={<ShareIcon style={{ fontSize: 25 }} className={classes.shareButton}/>}
                iconActive={<MdClose style={{ fontSize: 20 }}/>}
                onClick={() => setIsOpen(!isOpen)}
                size={50}
                style={{backgroundColor:"white"}}
                
            />
            <ChildButton
                icon={<WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool' url={"https://covidsupportfindertool.z33.web.core.windows.net/"} ><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon></span></div></WhatsappShareButton>}
                size={35}
                

            />
            <ChildButton
                icon={<EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool Invite' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon></span></div></EmailShareButton>}
                size={35}
            />
        </FloatingMenu>
    )
}

export default FloatingButton;