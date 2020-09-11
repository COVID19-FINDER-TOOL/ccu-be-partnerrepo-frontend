import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import MDReactComponent from 'markdown-react-js';
import LaunchIcon from '@material-ui/icons/Launch';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import MicIcon from '@material-ui/icons/Mic';
import BookIcon from '@material-ui/icons/Book';
import { Col, Row } from 'react-bootstrap';
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "3%"

    },
    cardroot: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },

}));

const assembleData = (data) => {
    const keys = Object.keys(data)
    const values = Object.values(data)
    return [keys, values]
}

const handleIterate = (Tag, props, children, level) => {
    if (Tag === 'a') {
        props = {
            ...props,
            target: "_blank",
            href: props.href
        };
    }
    return <Tag {...props}>{children}</Tag>;

}

const sendIcon = (index) => {
    switch (index) {
        case 0: {return "/video.png" ;break}
        case 1: return "/podcast.png"; break
        case 2: return "/reading.png";break
        default: return "/video.png" ;break
    }
}

const generateLinks = (data, topic) => {
    const links = data.map((x, index) => {
        const x1 = x.split(":");
        const x2 = x1.slice(1).join(":");
        const icon = sendIcon(index)
        const style = {
            display:"block", margin: "auto", borderRadius: "5%"
        }
        return (

            <Card style={{ marginTop: "5%", backgroundColor: "#EDEDED", outline: "none", minWidth: "100%" }}>
                <CardActionArea>

                    {topic == 3 ?

                        <CardContent style={{ display: "flex", paddingBottom: "0px" }}>
                            <LaunchIcon style={{ backgroundColor: "white", boxShadow: " 0px 3px 6px #00000029", marginRight: "10px", borderRadius: "20%", fontSize: "30px" }}></LaunchIcon>
                            <Typography gutterBottom variant="body1" component="p">
                                <MDReactComponent key={index} text={x} onIterate={handleIterate} />
                            </Typography>
                        </CardContent>

                        :
                        <CardContent >
                            <Row>
                                <Col md={4} style={{display:"flex"}}>
                                    <img
                                        style={style}
                                        src={require("../../assets/Images"+icon)}
                                    />
                                </Col>
                                <Col md={8} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography gutterBottom variant="h6" component="h2" style={{ textAlign: "center" }}>
                                        {x1[0]}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="p">
                                        <MDReactComponent key={index} text={x2} onIterate={handleIterate} />
                                    </Typography>
                                </Col>
                            </Row>
                        </CardContent>

                    }


                </CardActionArea>
            </Card >

        )
    })
    return (links)
}

const generatetabs = (data, value) => {
    const tabs = data[0].map((x, index) => {
        return (
            <Tab key={index}
                style={{
                    maxWidth: "7rem",
                    color: "#f5f5f5",
                    borderRight: "1px solid #f5f5f5",
                    outline: 0,
                    borderLeft: index === 0 ? "1px solid #f5f5f5" : "none",
                    backgroundColor: value === index ? "#D4121E" : "#A8A8A7",
                    fontSize: "0.8rem",
                    paddingTop: "20px"
                }}
                wrapped
                label={<MDReactComponent key={index} text={x.slice(3)} onIterate={handleIterate} />}
                {...a11yProps(index)} />
        )
    })
    return (tabs)
}


export default function NavTabs(props) {
    console.log(props)
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const rights = assembleData(props.data);
    const topic = props.topic
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    console.log(rights)

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ width: "fit-content", zIndex: "unset" }}>
                <Tabs variant="fullWidth" centered value={value} TabIndicatorProps={{ style: { height: "3px", backgroundColor: "#f5f5f5" } }} onChange={handleChange} aria-label="Know your rights tab" style={{ backgroundColor: "#A8A8A7" }}>
                    {generatetabs(rights, value)}
                </Tabs>
            </AppBar>
            <TabPanel style={{minWidth:"70%"}} value={value} index={0}>
                {generateLinks(rights[1][0], topic)}
            </TabPanel>
            <TabPanel style={{minWidth:"70%"}} value={value} index={1}>
                {generateLinks(rights[1][1], topic)}

            </TabPanel>
            <TabPanel style={{minWidth:"70%"}} value={value} index={2}>
                {generateLinks(rights[1][2], topic)}

            </TabPanel>
        </div>
    );
}
