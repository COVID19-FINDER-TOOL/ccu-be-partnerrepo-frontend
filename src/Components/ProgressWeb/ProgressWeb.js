import React from 'react';
import { Steps } from 'antd';
import 'antd/dist/antd.css';
import classes from './ProgressWeb.scss';
import classesExt from './ProgressWebExtend.module.scss';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import { MenuContext } from 'react-flexible-sliding-menu';
import CloseIcon from '@material-ui/icons/Close';
import litrals from '../Litrals/Litrals';

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
      <div className={classesExt.ssContainer}>
        <Steps current={current}  size="small" onChange={this.onChange} onClick={this.onClick} direction="horizontal">
          <Step title="Situation"  />
          <Step title="Options" />
          <Step title="Action Plan" />
        </Steps>
        {
            this.props.showCloseIcon ? 
            <div className={classesExt.closeContainer}>
                {litrals.gotoHomeForWelcome}
                <div className={classesExt.closeIcon} onClick={this.props.backToWelcome}>
                    <CloseIcon color="action" />
                </div>
            </div>: <></>
        }
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

const ProgressWebData = connect(mapStateToProps, mapDispatchToProps)(ProgressWeb);

export default ProgressWebData;