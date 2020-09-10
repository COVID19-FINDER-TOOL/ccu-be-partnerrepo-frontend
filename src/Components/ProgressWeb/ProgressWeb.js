import React from 'react';
import { Steps, Divider } from 'antd';
import 'antd/dist/antd.css';
import classes from './ProgressWeb.scss';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { MenuContext } from 'react-flexible-sliding-menu';
const { Step } = Steps;
const mobile = window.matchMedia("(max-width: 600px)").matches;
class ProgressWeb extends React.Component {
    static contextType = MenuContext;
    constructor(props){
        super(props);
        this.state = {
            current: this.props.section
          };
    }
  

  onChange = current => {
    
  };

  onClick = () =>{
    console.log(mobile)
    if(mobile){
    const {toggleMenu, setMenuProps} = this.context;
    setMenuProps(this.props);
    toggleMenu();
    }
  }

  render() {
    
    const current = this.props.section ? this.props.section-1  : 0
    return (
      <>
        <Steps current={current} progressDot style={{height:"50%"}}  onChange={this.onChange} onClick={this.onClick} direction="vertical">
          <Step title="Tell us about yourself"  />
          <Step title="View your Options" />
          <Step title="Know your rights" />
          <Step title="Review your action plan" />
          <Step title="Hear from others" onClick={this.props.callHearFromOthers} />
        </Steps>
      </>
    );
  }
}

const mapStateToProps = state => {
    return { payload: state.surveyData };
};

const mapDispatchToProps = dispatch => {
    return {
        onEditInspection: data => dispatch(onEditInspection(data)),
        surveyData: data => dispatch(surveyData(data))
    };
};

const ProgressWebData = connect(mapStateToProps, mapDispatchToProps)(ProgressWeb);

export default ProgressWebData;