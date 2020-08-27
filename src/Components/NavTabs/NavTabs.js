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
    console.log(keys, values)
    // const values = data.map((x)=>{
    //     return {x.}
    // })
    return [keys, values]
}

const generateLinks = (data) => {
    const links = data.map((x) => {
        return(
            <MDReactComponent text={x} /> 
        )
    })
    return (links)
}


export default function NavTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const rights = assembleData(props.data);
    console.log(rights)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    console.log(value)

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example" style={{ backgroundColor: "#D4121E" }}>
                    <Tab style={{ maxWidth: "7rem", backgroundColor: value == 0 ? "#F07D29" : "#D4121E", color: "#f5f5f5", "focus": { outline: "none" } }} wrapped label={rights[0][0].slice(3)} {...a11yProps(0)} />
                    <Tab style={{ maxWidth: "7rem", backgroundColor: value == 1 ? "#F07D29" : "#D4121E", color: "#f5f5f5", "focus": { outline: "none" } }} wrapped label={rights[0][1].slice(3)} {...a11yProps(1)} />
                    <Tab style={{ maxWidth: "7.4rem", backgroundColor: value == 2 ? "#F07D29" : "#D4121E", color: "#f5f5f5", "focus": { outline: "none" } }} wrapped label={rights[0][2].slice(3)} {...a11yProps(2)} />
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
