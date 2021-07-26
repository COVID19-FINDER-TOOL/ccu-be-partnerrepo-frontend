import React from 'react';
import { Steps } from 'antd';
import 'antd/dist/antd.css';
import classes from './ProgressWeb.scss';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { MenuContext } from 'react-flexible-sliding-menu';
const { Step } = Steps;
const mobile = window.matchMedia("(max-width: 767px)").matches;
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
    
    const current = this.props.section ? this.props.section > 2 ?  this.props.section-2 :  this.props.section-1  : 0 
    return (
      <>
        <Steps current={current}  size="small" onChange={this.onChange} onClick={this.onClick} direction="horizontal">
          <Step title="Situation"  />
          <Step title="Options" />
          <Step title="Action Plan" />
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