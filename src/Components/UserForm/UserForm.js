import React from 'react'
import Header from '../Header/Header';
import classes from './UserForm.module.scss';
import { Form, Row, Col, Container } from 'react-bootstrap';
// import CustomRadio from '../CustomRadio/CustomRadio';
import CustomSelect from '../CustomSelect/CustomSelect';
import CustomInput from '../CustomInput/CustomInput';

import litrals from '../Litrals/Litrals';
import Footers from '../Footers/Footers';
import { axiosFormInstance, axiosLoginInstance } from '../../AxiosHandler';
import moment from "moment";
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { login, onEditInspection } from "../../store/Action/LoginAction";
import axios from 'axios';
import packageJson from '../../../package.json';
import PropTypes from 'prop-types';



// import OptionButtons from '../OptionButtons/OptionButtons';
// import CustomButton from '../CustomButton/CustomButton';

import Loadable from "react-loadable";
import Loading from '../Loading/LoadingPage'

import loader from '../../assets/Images/Spinner-1s-200px.svg'; // with import
// import CustomSelect from '../CustomSelect'

const CustomButton = React.lazy(() => import('../CustomButton/CustomButton'));
// const CustomSelect = React.lazy(() => import('../CustomSelect/CustomSelect'));

// Loadable({
//   loader:() => import('../CustomButton/CustomButton'),
//   loading: Loading
// });
global.appVersion = packageJson.version;
class UserForm extends React.Component {

  optionData;
  userData;

  constructor(props) {
    super(props);

    this.state = {
      start: false,
      part: true,
      agree: 0,
      toggle: 0,
      msg: 0,
      links: [],
      disagree:0,
      age: '',
      ethnicity: '',
      gender: '',
      salary: '',
      debt: '',
      emplstatus: '',
      education: '',
      disability: '',
      illhealth: '',
      loan: '',
      postcode: '',
      showSpinner: false,
      disable: true
    }
  }

  componentDidMount = () => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };
    axios({
      method: 'get',
      url: process.env.REACT_APP_UI + 'properties.json?v=' + global.appVersion,
    }).then((response) => response.data)
      .then((prop) => {
        const welcomeLinks = prop.Welcomelinks
        this.setState(() => { return { links: welcomeLinks } })

      });
    this.getUserId()
    this.getQuestionData()
  }

  getUserId = async () => {
    this.userData = JSON.parse(window.localStorage.getItem("csf_user"))
  }

  getQuestionData = async () => {
    // const data = { "question": "mark one testing done" }
    await this.setState(() => { return {showSpinner: true}})
    await axios.get("https://cft-backendfunction.azurewebsites.net/api/CFTRetriveDataTrigger")
      .then(res => {
        this.optionData = res.data;
        // this.setState(() => { return { data: [...this.state.users, OptionData], showSpinner: false } });
        // this.setState(() => {return { data: [...this.state.data, OptionData]}})
        this.setState(() => { return { showSpinner: false } });
      }).catch(error => {
        console.log(error);
      });
  }


  handleNext = () => {
    this.setState({
      ...this.state,
      start: true
    })
    if (window.localStorage.getItem("csf_user")) {
      const user = JSON.parse(window.localStorage.getItem("csf_user"))
      // this.props.history.push("/Chatbot");
      this.props.history.push('/Chatbot')
    } else {
      this.handleSubmit()
    }
  }

  handleStart = () => {
    if(this.state.age.length != 0  && 
      this.state.debt.length != 0 &&
      this.state.disability.length != 0 &&
      this.state.education.length != 0 &&
      this.state.education.length !=0 &&
      this.state.ethnicity.length !=0 &&
      this.state.gender.length != 0 &&
      this.state.illhealth.length != 0 &&
      this.state.loan.length != 0 &&
      this.state.postcode.length != 0 &&
      this.state.salary.length != 0
      ){
        this.saveQuizApiHandler();
      } else {
        alert('Please answer all the questions.')
      }
  }

  saveQuizApiHandler = async () => {
    await this.setState(() => { return {showSpinner: true}})
    let respBody = {
      userid : this.userData.user_id,
      age: this.state.age,
      ethnicity: this.state.ethnicity,
      gender: this.state.gender,
      salary: this.state.salary,
      debt: this.state.debt,
      emplstatus: this.state.emplstatus,
      education: this.state.education,
      disability: this.state.disability,
      illhealth: this.state.illhealth,
      loan: this.state.loan,
      postcode: this.state.postcode,
    }
    await axios.post("https://cft-backendfunction.azurewebsites.net/api/CFTRetriveDataTrigger", respBody)
      .then(res => {
        if (window.localStorage.getItem("csf_user")) {
          const user = JSON.parse(window.localStorage.getItem("csf_user"))
          // this.props.history.push("/Chatbot");
          this.props.history.push('/Chatbot')
        }
      }).catch(error => {
        console.log(error);
      });
  }

  handleInputChange = (e) => {
    const value = e.target.value;
    value && value !== '' ? this.setState(() => { return {postcode: value}}) : this.setState(() => { return {postcode: ''}})
  }

  handleChange = (selectedOption, $event) => {
    const index = selectedOption;

    switch (index.selectId){
      case 'age':
            return this.setState(() => {
              return {
                age : index.value
              }
            });
      case 'debt':
        return this.setState(() => {
          return {
            debt : index.value
          }
        });
      case 'disability':
        return this.setState(() => {
          return {
            disability : index.value
          }
        });
      case 'education':
        return this.setState(() => {
          return {
            education : index.value
          }
        });
      case 'empstatus':
        return this.setState(() => {
          return {
            emplstatus : index.value
          }
        });
      case 'ethinicity':
      return this.setState(() => {
        return {
          ethnicity : index.value
        }
      });
      case 'gender':
      return this.setState(() => {
        return {
          gender : index.value
        }
      });
      case 'illhealth':
        return this.setState(() => {
          return {
            illhealth : index.value
          }
        });
      case 'loan':
        return this.setState(() => {
          return {
            loan : index.value
          }
        });
      case 'salary':
        return this.setState(() => {
          return {
            salary : index.value
          }
        });
  
      default:
        return this.state;
          
    }
  }


  render() {

    

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const btn = <div >
      <CustomButton float={"left"}
        margin={mobile ? "" : "20px 15px 0 0"}
        width={mobile ? "100%" : ""}
        type="submit"
        onClick={this.handleDisagree}
        data={litrals.buttons.disagreeButton}>
      </CustomButton>
      <CustomButton float={"left"}
        margin={mobile ? "" : "20px 0 0 0"}
        width={mobile ? "100%" : ""}
        type="submit"
        onClick={this.handleStart}
        data={litrals.buttons.submitForm}
        disabled={!this.state.disable}
        >
      </CustomButton>
    </div>

    return (
      <div className={classes.backgrondImage}>
        <Header heading={this.state.part ? "8" : undefined} showHomeModal={this.showHomeModal}></Header>
        

        <div style={{ display: this.state.showSpinner ? "block" : "none" }}>
            <img alt="Loading...!!! " className={classes.spinner} src={loader}></img>
          </div>
        <div>

          { !this.state.showSpinner ? 
          <div className={classes.wlcmRow}>

            {this.state.data}
            <Row style={{ width: '100%' }}>
            <Col xs={12} md={6}>
                <h3 className={classes.leftText}>
                  Hello I am everything. Hello I am everything. Hello I am everything. Hello I am everything
                </h3>
              </Col>
              <Col xs={12} md={6} className={classes.colTabs}>
                <div>
                  {/* <OptionButtons partition={true} array={litrals.welcome.ribbonButtons} /> */}
                  {/* <h3 className={classes.tabsHeading}>What we need to do</h3> */}

              {/* Q.1 starts */}
                  <h5 className={classes.tabsSubHeading}>Q.1 - Which is your age bracket? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Age} 
                    id="age"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>

              {/* Q.2 starts */}
                  <h5 className={classes.tabsSubHeading}>Q.2 - What is your ethnicity? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Ethinicity} 
                    id="ethinicity"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.3 starts */}
              <h5 className={classes.tabsSubHeading}>Q.3 - What gender you identify as? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Gender} 
                    id="gender"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>

                {/* Q.4 starts */}
              <h5 className={classes.tabsSubHeading}>Q.4 - What are the first three characters of your postcode? </h5>
                  <CustomInput
                    id="postcode"
                    type="text"
                    name="postCode"
                    onClick={this.handleInputChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.5 starts */}
              <h5 className={classes.tabsSubHeading}>Q.5 - What is your employment status?</h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Empstatus} 
                    id="empstatus"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.6 starts */}
              <h5 className={classes.tabsSubHeading}>Q.6 - What is your salary bracket (if applicable)? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Salary} 
                    id="salary"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.7 starts */}
              <h5 className={classes.tabsSubHeading}>Q.7 - What is the value of your total debt? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Debt} 
                    id="debt"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.8 starts */}
              <h5 className={classes.tabsSubHeading}>Q.8 - What is the highest level of education you have? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Education} 
                    id="education"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.9 starts */}
              <h5 className={classes.tabsSubHeading}>Q.9 - Do you consider yourself to have a disability?</h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Disability} 
                    id="disability"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.10 starts */}
              <h5 className={classes.tabsSubHeading}>Q.10 - Do you consider yourself to suffer from ill health? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Illhealth} 
                    id="illhealth"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>
                  
              {/* Q.11 starts */}
              <h5 className={classes.tabsSubHeading}>Q.11 - What was the outcome of your loan request? </h5>
                  <CustomSelect 
                    optionValue={this.optionData?.Loan} 
                    id="loan"
                    onClick={this.handleChange}
                  />
                  <p className={classes.tabsPara}></p>


                  
                </div>
                <div>
                </div>
              </Col>
            </Row>
          </div>
        : ''}

        </div>
        {!mobile ? <Footers format={this.state.part} buttonpanel={btn}></Footers> : this.state.start && btn}
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return { payload: state.surveyData };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     login: data => dispatch(login(data)),
//     onEditInspection: data => dispatch(onEditInspection(data)),
//     surveyData: data => dispatch(surveyData(data))
//   };
// };

// const UserFormData = connect(mapStateToProps, mapDispatchToProps)(UserForm);

// UserFormData.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default (UserFormData);

export default UserForm
