import React from 'react';
import '../ProgressWeb/ProgressMenu.scss';
import { Steps, Divider } from 'antd';
import 'antd/dist/antd.css';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { MenuContext } from 'react-flexible-sliding-menu';
import Footers from '../Footers/Footers';

const { Step } = Steps;

class ProgressMenu extends React.Component {
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
    const {toggleMenu, setMenuProps} = this.context;
    setMenuProps(this.props);
    toggleMenu();
  }

  render() {
    // console.log(this.props)
    const current = this.props.section ? this.props.section-1  : 0

    return (
      <>
      <p className={"logodiv"}> <img className={"logoImage"} onClick={this.props.showHomeModal} width={"30px"} src={require('../../assets/Images/Support_finder_logo.png')}></img>Support Finder</p>

        <Steps current={current} progressDot onChange={this.onChange} onClick={this.onClick} direction="vertical">
          <Step title="Tell us about yourself"  />
          <Step title="View your options" />
          <Step title="Know your rights" />
          <Step title="Review your action plan" />
          <Step title="Hear from others" onClick={this.props.callHearFromOthers} />
        </Steps>
        <div style={{marginLeft:"1rem"}}><Footers></Footers></div>
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

const ProgressMenuData = connect(mapStateToProps, mapDispatchToProps)(ProgressMenu);

export default ProgressMenuData;