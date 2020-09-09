import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MDReactComponent from 'markdown-react-js';

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
        border: "1px",
        borderColor: "orange",
        borderStyle: "solid",
        borderRadius: "10px"
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
    // console.log(key)
    return <Tag {...props}>{children}</Tag>;
}
const generateLinks = (data) => {
    const links = data.map((x, index) => {
        return (
            <MDReactComponent key={index} text={x}  onIterate={handleIterate} />
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
                    borderRight: "2px solid darkgray",
                    outline: 0,
                    borderLeft: index === 0 ? "2px solid darkgray" : "none",
                    backgroundColor: value === index ? "#F07D29" : "#D4121E",                    
                }}
                wrapped
                label={x.slice(3)}
                {...a11yProps(index)} />
        )
    })
    return (tabs)
}


export default function NavTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const rights = assembleData(props.data);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs centered value={value} TabIndicatorProps={{ style: { height: "3px", backgroundColor: "#D4121E" } }} onChange={handleChange} aria-label="Know your rights tab" style={{ backgroundColor: "#D4121E" }}>
                    {generatetabs(rights, value)}
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                {generateLinks(rights[1][0])}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {generateLinks(rights[1][1])}

            </TabPanel>
            <TabPanel value={value} index={2}>
                {generateLinks(rights[1][2])}

            </TabPanel>
        </div>
    );
}
