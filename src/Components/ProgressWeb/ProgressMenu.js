import React from 'react';
import '../ProgressWeb/ProgressMenu.scss';
import { Steps } from 'antd';
import 'antd/dist/antd.css';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { MenuContext } from 'react-flexible-sliding-menu';
import Footers from '../Footers/Footers';


const { Step } = Steps;

class ProgressMenu extends React.Component {
  static contextType = MenuContext;
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.section
    };
  }


  onChange = current => {

  };

  onClick = () => {
    const { toggleMenu, setMenuProps, closeMenu } = this.context;
    setMenuProps(this.props);
    toggleMenu();
  }

  render() {
    // console.log(this.props)
    const current = this.props.section ? this.props.section > 2 ? this.props.section - 2 : this.props.section - 1 : 0

    return (
      <div onClick={this.onClick} onTouchMove={this.onClick}>
        <p className={"logodiv"} onClick={this.props.showHomeModal}> <img className={"logoImage"} width={"30px"} src={require('../../assets/Images/Support_finder_logo.png')}></img>Support Finder</p>

        <Steps current={current} progressDot onChange={this.onChange} className={"diff"} onClick={this.onClick} direction="vertical">
          <Step title="Tell Us About Yourself" />
          <Step title="View Your Options" />
          <Step title="Review Your Action Plan" />
          <Step title="Hear From Others" />
        </Steps>
        <div><Footers></Footers></div>
      </div>
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