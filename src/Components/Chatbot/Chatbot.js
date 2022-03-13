import React from 'react'
import classes from './Chatbot.module.scss';
import { Form, Row, Col, Container } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import DownloadActionPlan from '../DownloadActionPlan/DownloadActionPlan';
import CustomButton from '../CustomButton/CustomButton';
import Email from '../Email/Email';
import Warning from '../Warning/Warning';
import litrals from '../Litrals/Litrals';
import { axiosInstance, axiosLoginInstance } from '../../AxiosHandler';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection, onCleanCreateJourney } from "../../store/Action/LoginAction";
import moment from "moment";
import { PDFDownloadLink } from '@react-pdf/renderer'
import NavTabs from '../NavTabs/NavTabs';
import MDReactComponent from 'markdown-react-js';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Header from '../Header/Header';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import {
    WhatsappShareButton,
} from "react-share";
import ProgressWeb from '../ProgressWeb/ProgressWeb';

import MenuProvider from 'react-flexible-sliding-menu';
import ProgressMenu from '../ProgressWeb/ProgressMenu';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import Footers from '../../Components/Footers/Footers';
import Menubar from '../Menubar/Menubar';
import { TransferWithinAStationSharp } from '@material-ui/icons';
import { getKeyThenIncreaseKey } from 'antd/lib/message';
import loader from '../../assets/Images/Spinner-1s-200px.svg'; // with import
class Chatbot extends React.Component {

    visitedLinks = [];
    emailData = [];
    
    key = -1;
    constructor(props) {
        super(props);
        this.blobData = null;
        this.blobUrl = ""
        this.myCustomHTML= React.createRef()
        this.state = {
            data: "",
            requestBody: { "question": "Start the flow" },
            msg: false,
            pdf: false,
            showBack: true,
            showFeedback: false,
            showActionPlan:true, // to hide the text before actual action plan page
            condition: "",
            showSpinner: true,
            metadata: "",
            topicId: 1,
            questionStack: [],
            responseStack: [],
            backStack: [],
            change: false,
            showHomeModal: false,
            section: 0,
            queryIndex: 0,
            queryString: ["042d2761-8791-4ef6-a97c-6edabb9ad7f9/generateAnswer", 'aafa576b-8d0c-4586-af50-4e47f56ceca4/generateAnswer', "0c6be717-519a-47d1-a45b-10957b0dc32d/generateAnswer", '3da1cc64-b289-41eb-aef8-7c3cd21d247f/generateAnswer', "92a113b0-4a0e-41ee-93bc-b576784d08c6/generateAnswer", "bf855b48-b569-4349-be23-be9f7e3280ac/generateAnswer"],
            disagree: 0,
            showTextArea: 0,
            textAreaValue: "",
            selectedJourneys:[],
            showNextJourney: false,
            gotoNextJourney:false,
            currentJourney : "",
            count:0,
            showWarningMessage:false,
            emailSent: false
            //queryString: ["3cc6844e-5293-45ab-86ae-80597e435067/generateAnswer", '666d5d58-8586-48a5-bcc2-c3522a199cd1/generateAnswer', "230c1eb8-8ef2-41a8-a056-afe3a60ae832/generateAnswer", 'bb6980d7-0f8c-4190-b7e1-cfc1b2eacd79/generateAnswer', "a553abad-9753-469c-a1a4-ae267fd588c1/generateAnswer"]  //prod
        }

        if (window.performance) {
            console.info("window.performance works fine on this browser");
          }
          console.info(performance.navigation.type);
          if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
            console.info( "This page is reloaded" );
            this.props.history.push("/chatbot")
          } else {
            console.info( "This page is not reloaded");
          }
    }

    componentDidMount = () => {
        const { CREATEJOURNEY } = this.props.payload;
        const { disagree } = CREATEJOURNEY ? CREATEJOURNEY : 0
        this.props.onEditInspection({ questionStack: [], responseStack: [], metadata: "" ,selectedJourneys:[]})
        if (disagree === 1) {
            this.setState(() => { return { queryIndex: 5, disagree: 1 } })
        } else {
            this.setState(() => { return { queryIndex: 0, disagree: 0 } })
        }
        setTimeout(() => {
            this.fetch();
            this.setPdf();
        }, 100);
    }


    handleWarning = () => {
        console.log("warning handled")
        this.setState(() => {
            return {emailSent: true}
        })
    } 
 
    saveQuestion = (data, response, notFetch) => {
        console.log(data,response, notFetch,'Save Button');
        var dataBody = {}
        var kb = this.state.disagree ? "kb5" : data.metadata.find((x) => x.name === "idprefix") ? data.metadata.find((x) => x.name === "idprefix").value : "kb0";
        dataBody.question_id = kb.concat("q").concat(data.id.toString());
        dataBody.question = data.answer;
        dataBody.answers = data.context?.prompts.map((x) => {
            return { aid: kb.concat("a").concat(x.qnaId.toString()), answer: x.displayText.toString() }
        })
        response.question_id = kb.concat("q").concat(response.question_id.toString())
        response.answer_id = kb.concat("a").concat(response.answer_id.toString())

        if (data.metadata.find((x) => x.name === "topic" && x.value != "1")) {
            this.fetch();
        }
        else {
            console.log('respnse', response)
            this.saveInStorage(response)
            // axiosLoginInstance.post("CFTQnAInsertTrigger/add", dataBody)
            //     .then(res => {
            //         const data = res.data;
            //         console.log(data);
            //     }).catch(error => {
            //         console.log(error);
            //     });
            notFetch ? console.log() : this.fetch();

        }
    }

    clearJourneyData = () => {
        this.props.onEditInspection({
            metadata: "",
            questionStack: [],
            responseStack: [],
            start_time: "",
            backStack: [],
            selectedJourneys:[]
        })
        this.setState(() => {
            return {
                questionStack: [],
                responseStack: [],
                backStack: [],
                metadata: "",
                gotoNextJourney:false,
                
            }
        })
    }

    endJourney = () => {
        this.clearJourneyData()
        const { CREATEJOURNEY } = this.props.payload;
        const { journey_id } = CREATEJOURNEY ? CREATEJOURNEY : ""
        const dataBody = {
            "journey_id": journey_id,
            "completed": 1,
            "complete_time": moment.utc().format('YYYY-MM-DD hh:mm:ss')
        }

        axiosLoginInstance.post("CFTJourneyUpdateTrigger/update", dataBody)
            .then(res => {
                const data = res.data;
                console.log(data);
                // this.clearJourneyData()
            }).catch(error => {
                console.log(error);
            });
    }

    fetch = (str) => {
        // console.log(this.state, str)
        const body = str ? str.body : this.state.requestBody
        this.setState(() => { return { showSpinner: true, questionStack: str ? this.state.questionStack : this.state.questionStack.concat({ body }) } })
        axiosInstance.post(str ? str.query : this.state.queryString[this.state.queryIndex], body)
            .then(res => {
                const data = res.data.answers[0];
                let metaIndex = data.metadata.find((x) => x.name === "topic")
                
                const section = metaIndex ? Number(metaIndex.value) : body.question == "Start the flow" ? 0 : this.state.section
                if (data.id === -1) {
                    this.props.onEditInspection({
                        responseStack: [],
                        questionStack: [],
                        metadata: "",

                    })
                    this.props.history.push("/feedback")
                }
                this.props.onEditInspection({ section })
                this.setState(() => { return { data: data, showSpinner: false, section: section, showHearFromOthers: str ? true : false, } });
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { showSpinner: false } })
            });
        if (!str) {
            const { questionStack } = this.state;

            this.props.onEditInspection({ questionStack })
        }
    }

    handleRadio = (event) => {
        
        const value = this.state.section == 3 ? "Action Plan" : event.target.value
        const id = event.target.id
        const currentResponses = { value, id }

        
        if(this.state.queryIndex == 0) {
            const { CREATEJOURNEY } = this.props.payload;
            const { selectedJourneys } = CREATEJOURNEY ? CREATEJOURNEY : [];
            let currentValues = selectedJourneys
            
            let hasObject = currentValues.findIndex(ele => ele['id'] === id)
            hasObject >= 0 ? currentValues.splice(hasObject,1)   :  currentValues.push(currentResponses)    
            this.setState(() => {
                return {
                    selectedJourneys:currentValues

                }
            })
            this.props.onEditInspection({ selectedJourneys: currentValues })


        }
        
        const value_ = this.state.queryIndex !==0  ? currentResponses : {}
            this.setState(() => {
                return {
                    currentResponses : value_,
                    selected: true,
                    msg: false
                }
            },
             () => { this.state.section >= 2 ? this.handleSubmit() : console.log() })

        if (this.state.disagree === 1) {
            id === "5" ? this.setState(() => { return { showTextArea: 1 } }) : this.setState(() => { return { showTextArea: 0 } })
        }

    }

    handleDisagree = (data) => {
        const { LOGIN } = this.props.payload;
        const { user } = LOGIN ? LOGIN : ''
        const { user_id } = user ? user : JSON.parse(window.localStorage.getItem("csf_user"));

        const resbody = {
            "user_id": user_id,
            "answer_id": "kb5a" + data.answer_id,
            "other_reason": this.state.showTextArea ? this.state.textAreaValue : "",
            "creation_time": data.answer_time
        }
        axiosLoginInstance.post("/CFTDenialTrigger/disagree", resbody)
            .then(res => {
                this.clearJourneyData()
                
                
            }).catch(error => {
                console.log(error);
            });
        window.localStorage.removeItem('csf_user')
        this.props.history.push('/')
    }

    onDisagreeTextAreaInput = (event) => {
        this.setState({ textAreaValue: event.target.value })
    }

    handleSubmit = () => {
        const { CREATEJOURNEY } = this.props.payload
        var { journey_id, start_time } = CREATEJOURNEY ? CREATEJOURNEY : ""
        var { responseStack, backStack, selectedJourneys } = CREATEJOURNEY ? CREATEJOURNEY : []
        // const currentResponse = backStack ? backStack[backStack.length - 1] : ""
        const currentResponse = backStack ? backStack[backStack.length - 1] : ""
        const state_data = this.state.data
        console.log('Create Journey', CREATEJOURNEY)


        if (this.state.selected || currentResponse || this.state.section>=4) {
            var value = ""
            var id = "" 
            var newselectedJourneys = []
            // this.setState(() => { return { backStack: [0] } })
        
            if(this.state.queryIndex===0 && this.state.selectedJourneys.length && !this.state.backStack?.length){

                id =  parseInt(this.state.selectedJourneys[0]?.id)
                value = this.state.selectedJourneys[0]?.value
                newselectedJourneys = selectedJourneys?.filter((x)=>x.id != id)
                this.setState(() => { return { selectedJourneys:newselectedJourneys } })
                
            this.setState({
                currentJourney: value
            });
                
            }
            else if(this.state.queryIndex===0 && this.state.selectedJourneys.length  && this.state.backStack?.length){
                id =  parseInt(this.state.selectedJourneys[0]?.id)
                value = this.state.selectedJourneys[0]?.value
                newselectedJourneys = selectedJourneys?.filter((x)=>x.id != id)
                this.setState(() => { return { selectedJourneys:newselectedJourneys } })
                
            this.setState({
                currentJourney: value
            });
            }
            else{
                if (this.state.currentResponses?.value) {
                    value = this.state?.currentResponses?.value
                    id = this.state?.currentResponses?.id
                }
                else {
                    value = currentResponse?.descriptive_answer
                    id = currentResponse?.answer_id?.toString().substring(4)
                }     
                
            }

           

            var requestBody = {}
            const resbody = {
                "question_id": this.state.data.id,
                "answer_id": id ? id : "",
                "answer_time": moment.utc().format('YYYY-MM-DD hh:mm:ss'),
                "descriptive_answer": value,
            }
            //  console.log('current Response => ',currentResponse)

            if (this.state.disagree) {
                this.handleDisagree(resbody)
            }
            if (backStack && currentResponse) {
                if (currentResponse.answer_id.toString().substring(4) !== id) {
                    var dummy = [...backStack]
                    dummy.pop()
                    resbody["event_changed"] = "True";
                    resbody["answered"] = dummy
                    // console.log("Condition1", backStack)
                    backStack = []
                    this.setState(() => { return { backStack: [] } })

                }
                else {
                    // console.log("Condition2", backStack)
                    resbody["event_changed"] = "False";
                    resbody["answered"] = backStack


                }
                backStack = backStack.slice(0, -1)
            }
            else {
                resbody["event_changed"] = "False";
                resbody["answered"] = []
                // console.log("Condition3", backStack)

            }
            // console.log(resbody)
            responseStack = responseStack.concat(resbody)

            this.props.onEditInspection({ responseStack: responseStack, backStack })
            this.setState(() => { return { backStack } })

            // console.log(">>>>>>>>>>",id)

            if (this.state.queryIndex == 0) {

                var nextques = "Flow Started"
                requestBody = { "question": nextques };
                // console.log(journey_id, start_time)

                if (!(journey_id && start_time)) {
                    journey_id = "JID" + moment.utc().format('DDMMYYThhmmssSSS');
                    start_time = moment.utc().format('YYYY-MM-DD hh:mm:ss')

                    this.props.onEditInspection({ journey_id, start_time })
                    const dataBody = {

                        "journey_id": journey_id,
                        "started": 1,
                        "start_time": start_time
                    }
                    this.setState(() => { return { requestBody, selected: false, currentJourney: value  } }, () => { this.fetch() });

                    axiosLoginInstance.post("/CFTJourneyUpdateTrigger/add", dataBody)
                        .then(res => {
                            const data = res.data;
                            console.log(data);
                            const notFetch = true
                            this.saveQuestion(state_data, resbody, notFetch);
                        }).catch(error => {
                            console.log(error);
                        });
                }
                else {
                    this.setState(() => { return { requestBody, selected: false } }, () => { this.saveQuestion(this.state.data, resbody, false) });
                }
                this.setState(() => { return { queryIndex: id - 1 } });
                
            }
            else {
                const { metadata } = this.state.data
                // console.log(metadata)
                let metaIndex = metadata.find((x) => x.name === "context")
                
                let meta = metadata && metaIndex ? metaIndex.value : ""
                meta = meta + value?.replace(/ /g, '').replace('\n','').slice(0, 3).toLowerCase()
                // console.log(">>>>>>>>>>>",meta)
                this.props.onEditInspection({ metadata: meta })
                requestBody = {
                    "question": value,
                    "top": 1,
                    "strictFilters": [{ "name": "context", "value": meta }]
                };

                if(this.state.section >= 4  && this.state.selectedJourneys.length !== 0 ){

                    
                    if(this.state.gotoNextJourney){

                    const {selectedJourneys} = this.state
                    var ele = selectedJourneys[0].id
                    requestBody = {
                        "question": "Flow Started",
                        
                    };
                    var newselected = selectedJourneys?.filter((x)=>x.id != ele)
                    this.clearJourneyData()
                    this.setState(() => { return {requestBody, queryIndex: parseInt(ele)-1 , section: 0,selectedJourneys: newselected, showActionPlan:true, showNextJourney:false, showBack: true, visitedLinks: [], }},() => { this.fetch()} )
                    }
                }

                else{

                if (this.state.section >= 4 && this.state.selectedJourneys?.length === 0) {

                    // console.log(value, meta)
                    if (value == "Next") {

                        requestBody = {
                            "question": "loopback"
                        };
                        // clear the jouney selection
                        // Ankush : show warning should be handled here on next click

                        if (this.state.emailSent) {
                            this.setState(() => { 
                                return { showWarningMessage: false, showBack: false} 
                            })
                             this.setState(() => { return { requestBody, selected: false, currentResponses: {} }}, () => { this.saveQuestion(this.state.data, resbody, false) });
                             this.props.onEditInspection({journey_id:""})
                             this.endJourney();
                             
                             return

                        } else {
                            this.setState(() => { return { showWarningMessage: true } })
                            // this.props.onEditInspection({journey_id:""})
                            
                            return
                            
                        }
                         
                        
                        

                    }
                    else if ((value == "No" && meta === "loono") || (value == "No" && meta === "cornexno")) {
                        // this.setState(() => { return { section: 5 } })
                        // window.localStorage.removeItem('csf_user')

                        this.props.history.push("/feedback")                
                    }

                    // else if ((value == "Yes" && meta === "loonoyes") || (value == "Yes" && meta === "cornexnoyes")) {
                    //     this.setState(() => { return { showFeedback: true } })
                    // }

                    // else if ((value == "No" && meta === "loonono") || (value == "No" && meta === "cornexnono")) {
                    //     // this.props.history.push("/feedback")
                    // }

                    else if (value == "Yes" && meta !== "loonoyes") {

                        if (meta === "cornexyes") {
                            this.props.onEditInspection({responseStack:[]})
                            this.emailData=[]
                            this.setState(() => { return { section: 0, showSpinner: true } })
                            window.location.reload();
                        }
                        else {
                            this.visitedLinks = []
                            this.emailData=[]
                            this.setState(() => { return { queryIndex: 0, section: 0, showBack: true, visitedLinks: [],count:0, emailSent:false, showWarningMessage: false } })
                            this.props.onEditInspection({responseStack:[]})
                            requestBody = {
                                "question": "Start the flow",
                            };
                        }

                    }
                }

                this.setState(() => { return { requestBody, selected: false, currentResponses: {} }}, () => { this.saveQuestion(this.state.data, resbody, false) });
            }
                
            }


        }
        else {
            this.setState(() => {
                return {
                    msg: true
                }
            })
        }
    }

    saveInStorage = (user_response) => {
        const { CREATEJOURNEY } = this.props.payload;
        var { journey_id } = CREATEJOURNEY ? CREATEJOURNEY : "";

        const { LOGIN } = this.props.payload;
        const { user } = LOGIN ? LOGIN : ''
        const { user_id } = user ? user : JSON.parse(window.localStorage.getItem("csf_user"));

        user_response["user_id"] = user_id;
        user_response["topic_id"] = Number(this.state.queryIndex);
        user_response["journey_id"] = journey_id;

        const responseBody = { ...user_response }
        // console.log('userResponse => ', user_response)

        axiosLoginInstance.post("CFTUserJourneyTrigger/answer", responseBody)
            .then(res => {
                const data = res.data;
                console.log(data);
                // this.setState(() => { return { showSpinner: false } })
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { showSpinner: false } })

            });
    }

    sendDownloadInfo = (jid) => {
        const { CREATEJOURNEY } = this.props.payload
        const { journey_id } = CREATEJOURNEY ? CREATEJOURNEY : []
        axiosLoginInstance.post("CFTUserShareTrigger/download?journey_id=" + journey_id)
            .then(res => {
                const data = res.data;
                console.log(data);
            }).catch(error => {
                console.log(error);
            });
    }

    downloadActionPlan = () => {
        const { CREATEJOURNEY } = this.props.payload
        const { responseStack, journey_id } = CREATEJOURNEY ? CREATEJOURNEY : []
        return (
            <PDFDownloadLink
                onClick={this.sendDownloadInfo}
                document={<DownloadActionPlan data={this.state.data.answer} summary={responseStack} />}
                fileName="ActionPlan.pdf"
                className={classes.buttonColor1}
            >
                {
                    ({ blob, url, loading, error }) => {
                        this.blobData = blob ? blob : ""
                        this.blobUrl = url

                        return (loading ? "Loading.." : <img alt={"Download"} src={require("../../assets/Images/download.svg").default} />)
                    }

                }
            </PDFDownloadLink>
        )
    }

    setPdf = () => {
        this.setState({ pdf: true })
    }

    createForm = (prompts, id) => {

        const { CREATEJOURNEY } = this.props.payload;
        const { backStack } = CREATEJOURNEY ? CREATEJOURNEY : [];
        const { selectedJourneys } = CREATEJOURNEY ? CREATEJOURNEY : [];
         console.log("selectedJourneys",prompts)
        var res = ""
        if (backStack) {
            res = backStack.find(x => x.question_id.toString().substring(4) == id && x.question_id.toString()[2] == this.state.queryIndex)
        }

        if (prompts.length == 1) {
            const data = {
                buttonText: prompts[0].displayText,
                variant: "primary",
            }
            return [<div id={prompts[0].qnaId} key={prompts[0].qnaId} name={id} ><CustomButton float={"right"} data={data} id={prompts[0].qnaId} keys={prompts[0].qnaId} name={id} onClick={this.handleRadio}></CustomButton></div>]
        }
        else {
                const radios = prompts.map((x, index) => {
                    let checked = res && (x.qnaId == res.answer_id.toString().substring(4)) && (x.displayText == res.descriptive_answer) ? "checked" : false
                    
                    if(this.state.queryIndex === 0 && selectedJourneys != undefined) {
                        
                        const selectedOrNot = selectedJourneys.findIndex(ele => ele.id == x.qnaId)
                        selectedOrNot >= 0 ?  checked = "checked" : checked = false
                    }
                    return (
                        <CustomRadio section={this.state.section}
                            ind = {this.state.queryIndex}
                            radioLabel={x.displayText}
                            display={this.state.section == 4 && this.state.selectedJourneys.length !==0 ? false : true}
                            id={x.qnaId} key={x.qnaId}
                            name={id}
                            onClick={this.handleRadio}
                            checked={ checked} 
                            isCheckBox={this.state.queryIndex === 0 ? true : false}/> // : false would be there => Sachin
                    )
                })
                return (radios);
        }
    }

    handleBack = () => {

            const { CREATEJOURNEY } = this.props.payload
            var { backStack } = this.state
            const { responseStack, questionStack, section } = CREATEJOURNEY ? CREATEJOURNEY : "";
            // console.log(section)
            const previousResponse = responseStack[responseStack.length - 1];
            const exists = backStack ? backStack.find((x) => x.answer_id == previousResponse.answer_id) : false
            if (section < 4 && !exists) {
                backStack ? backStack.push(previousResponse) : backStack = [previousResponse]
            }
            const previousquestion = questionStack[questionStack.length - 1];
            const newMeta = previousquestion ? previousquestion.body.strictFilters ? previousquestion.body.strictFilters[0].value : "" : ""
            const newQueStk = questionStack.slice(0, questionStack.length)
            const newResStk = responseStack.slice(0, responseStack.length - 1)
            this.props.onEditInspection({ metadata: newMeta, questionStack: newQueStk, responseStack: newResStk, backStack })
            const requestBody = previousquestion ? previousquestion.body : { "question": "Start the flow" }
            const queryIndex = requestBody.question !== "Start the flow" ? this.state.queryIndex : 0
            //console.log(previousquestion)

            this.setState(() => { return { currentResponses: {}, msg: false, backStack, requestBody, queryIndex, questionStack: questionStack.slice(0, questionStack.length - 1) } }, () => { this.fetch() })

        

    }



    handleIterate = (Tag, props, children, level) => {
        let metaIndex = this.state.data.metadata.find((x) => x.name === "topic")
        if (Tag === 'h4' || Tag === 'h3' || Tag === 'h2') {
            props = {
                ...props,
                className: classes.heading
            };
        }


        if (Tag === 'p') {
            props = {
                ...props,
                className: metaIndex ? metaIndex.value == 4 ? classes.bullets : classes.list : classes.list
            };
        }

        if (Tag === 'ol') {
            props = {
                ...props,
                className: metaIndex ? metaIndex.value == 4 ? classes.bullets : classes.list : classes.list
            };
        }

        if (Tag === 'a') {
            props = {
                ...props,
                className: this.state.section == 4 ? classes.linkElement : classes.paraElement,
                target: "_blank",
                onClick: this.changeIcon,
                href: props.href
            };
        }
        // console.log(key)
        return <Tag {...props}>{children}</Tag>;
    }

    changeIcon = (event) => {
        const id = event.target.parentNode.parentNode
        this.visitedLinks = this.state.visitedLinks ? this.state.visitedLinks : []
        this.visitedLinks[id.start - 1] = true
        this.setState(() => { return { visitedLinks: this.visitedLinks } })


    }



    splitQuestionData = (topic) => {
        const text = this.state.data.answer;
        const tempText = text.split("\n\n######");
        const textarray = topic == 4 ? tempText[0].split("\n") : text.split("\n") ;
        const { CREATEJOURNEY } = this.props.payload
        var { responseStack, questionStack, selectedJourneys } = CREATEJOURNEY ? CREATEJOURNEY : []
        var texts = [];
        var links = [];
        var visitedLinks = [];
        var flows = []

        if(this.state.count)
        {
            let second = responseStack[0] ? responseStack[0].descriptive_answer : ""
            flows = [this.state.currentJourney, second]
        }else{
            flows = responseStack?.slice(0,2).map(x=>x.descriptive_answer)
        }
        
        if (topic == 4) {
            textarray.map((x) => {
                
                if (x.match(/^\d/)) {
                    let actionLinks = x.split('[')
                    links.push(actionLinks[1])
                    visitedLinks.push(false)

                } else {
                    texts.push(x)
                }
                this.visitedLinks = visitedLinks
                !this.emailData.find(x=>x.index == this.state.queryIndex) && questionStack[questionStack.length - 1] ? this.emailData = [...this.emailData,{
                    "index":this.state.queryIndex,
                    "flow":  flows,
                    "rights" : questionStack[questionStack.length - 1]?.body,
                    "actionPlan" : this.state.requestBody
                
                }]:console.log()
            })

            return (
                <>
                    <div className={classes.actionPlanFlex} style={{ display: this.state.showActionPlan && ! this.state.showNextJourney  ? "block" : "none" }}>
                        <p className={classes.actionPlanPara}>{litrals.actionPlanPara3}</p>
                        {
                            texts.map((x) => {
                                return <MDReactComponent text={x} onIterate={this.handleIterate}/>

                            })
                        }
                        <div className={classes.actionPlanFlex} >
                            {
                                links.map((x, index) => {
                                    this.key = index
                                    return (
                                        <div className={classes.actionPlanLinks}>
                                            <div md={10} xs={9} className={classes.linkSpan}><MDReactComponent text={'['+ x} onIterate={this.handleIterate} /></div>

                                            <div md={1} xs={2} className={classes.iconCenter}> <i className="fas fa-chevron-right"></i></div>
                                        </div>)
                                })
                            }
                        </div>
                        <h6 style={{paddingTop:10, marginLeft:-5}} >{tempText[tempText.length-1]}</h6>
                    </div>

                    <div style={{ display: !this.state.showActionPlan && this.state.showNextJourney && this.state.selectedJourneys.length ? "block" : "none"  }}>
                        {this.gotoNextJourney()}
                    </div>
                </>
            )
        }
        else {
            // if(this.state.queryIndex === 4){
            //     return this.state.showNextJourney  && this.state.selectedJourneys.length  ? this.gotoNextJourney() : <MDReactComponent text={text} onIterate={this.handleIterate} />
            // }
            return <MDReactComponent text={text} onIterate={this.handleIterate} />
        }

    }

    gotoNextJourney = () =>{
        return (
            <>
            <h1 className={classes.heading}>
                        {/* <delet>Please proceed to next jouney you have selected, which is related to <em>{this.state.selectedJourneys[0]?.value}</em></delet> */}
                        You have also selected <em>{this.state.selectedJourneys[0]?.value}</em> as something you would like help with. Do you want to proceed?
                        </h1>
                        
                        <CustomButton type="Submit"
                            float={"left"}
                            onClick={this.state.showSpinner ? console.log() : this.gotoFeedback}
                            data={litrals.buttons.no}>
                        </CustomButton>
                        <CustomButton type="Submit"
                            float={"left"}
                            onClick={this.state.showSpinner ? console.log() : this.handleOkay}
                            data={litrals.buttons.yes}>
                        </CustomButton>
            </>
        )
    }

    displayNextTopic = (topic) => {

        const text = this.state.data.answer;
        const otherText = text.split("\n\n")
        const textarray = otherText[1] ? otherText[1].split("\n") : text.split("\n");
        // console.log(otherText[0])
        var temp = {}
        var key = ""
        textarray.map((x) => {
            if (/^\d/.test(x.trim())) {
                key = x
            }
            else {
                temp[key] ? temp[key].push(x.trim()) : temp[key] = [x.trim()]
            }
        })
        return <Menubar data={temp} topic={topic} qindex = {this.state.queryIndex} text={otherText[1] ? otherText[0] : ""}></Menubar>

    }

    gotoFeedback = () => {
        this.setState(() => {
            return {
                showFeedback: false
            }
        },
            () => {
                this.props.history.push("/feedback")
            })
    }

    showHomeModal = () => {
        if (this.state.section && this.state.section != 5) {
            this.setState(() => { return { showHomeModal: true } })
        }
        else {
            this.props.history.push("/")
        }
    }

    gotoHome = () => {
        this.props.onEditInspection({
            backStack: [],
            journey_id: "",
            metadata: "",
            questionStack: [],
            responseStack: [],
            section: 0,
            start_time: ""
        })
        this.props.history.push('/')

    }

    closeHomeModal = () => {
        this.setState(() => { return { showHomeModal: false } })
    }

    handleOkay = () => {
        // console.log(this.state.currentJourney, this.state.selectedJourneys)
        const Next = this.state.selectedJourneys.length? this.state.selectedJourneys[0].value : ""
        this.setState(()=>{
            return {gotoNextJourney : true, currentJourney : Next, count:this.state.count+1}
        }, 
        ()=>{this.handleSubmit()})

    }

    render() {
        let metaIndex = this.state.data.metadata?.find((x) => x.name === "topic")
        const topic = this.state.data.metadata ? metaIndex ? metaIndex.value : 0 : 0;
        const paragraphs = this.state.data ? topic == 3 || topic == 5 || this.state.showHearFromOthers ? this.displayNextTopic(topic) : this.splitQuestionData(topic) : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts, this.state.data.id) : console.log()
        const mobile = window.matchMedia("(max-width: 600px)").matches;
        const { CREATEJOURNEY } = this.props.payload
        var { responseStack, questionStack } = CREATEJOURNEY ? CREATEJOURNEY : []
        const btn = (
        <div className={classes.buttonpanel}> <div style={{ width: "100%", marginTop: "1rem", display: this.state.showFeedback ? "none" : "flex" }}>
            {this.state.section > 0 && this.state.showBack && responseStack?.length ? <CustomButton type="submit" float={"left"} onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton> : ""}
            {this.state.section < 2 ?
                <CustomButton type="submit"
                    float={"right"}
                    onClick={this.state.showSpinner ? console.log() : this.handleSubmit}
                    data={this.state.disagree ? litrals.buttons.SubmitNav : litrals.buttons.nextStep}>
                </CustomButton>
                : (topic == 4 && this.state.showActionPlan && this.state.selectedJourneys.length) || (this.state.queryIndex == 4 && this.state.section == 2 && this.state.selectedJourneys.length) ? 
                <CustomButton type="submit" float={"right"}
                        onClick={()=> this.setState(()=> {return {showActionPlan:false, showNextJourney: true, showBack:false, section : 4}})}
                        data={litrals.buttons.nextStep}>
                    </CustomButton> :  
                radios && radios.length == 1 & this.state.showActionPlan ? radios : "" 
            }
            </div>

            <div style={{ width: "100%", marginTop: "1rem" }}>
                {this.state.showFeedback ? <CustomButton type="submit" float={"right"} width={mobile ? "100%" : ""} onClick={this.gotoFeedback} data={litrals.buttons.showFeedback}></CustomButton> : ""}

            </div>
        </div>)
        // this.props.onEditInspection({topic})
        
        return (

            mobile ?
                <MenuProvider width={"287px"} MenuComponent={ProgressMenu}>
                    <div className={classes.backgrondImage}>
                        <Header heading={this.state.section} loading={this.state.showSpinner} handleBack={this.handleBack} handleSubmit={this.handleSubmit} showBack={this.state.showBack} dynamicOptions={radios} CustomButton={topic == 4 && !this.state.showActionPlan ? this.showActionPlan : ""}></Header>
                        <ConfirmationModal modalFooter="dualButton" message={litrals.gotoHome} showModal={this.state.showHomeModal} onClick={this.gotoHome} onHide={this.closeHomeModal} />
                        <Container>
                            <Row className={classes.chatBotRow}>
                                <Col md={4} xs={1} style={{ padding: "0" }}>
                                    <ProgressWeb section={this.state.section} showHomeModal={this.showHomeModal}  ></ProgressWeb>
                                </Col>
                                <Col md={8} xs={11} style={{ height: "75vh", overflow: "auto", paddingBottom: "4rem" }}>
                                    <div style={{ display: this.state.showSpinner ? "block" : "none" }}>
                                        <img alt="Loading...!!! " className={classes.spinner} src={loader}></img>
                                        {/* <div>Loading...!!!</div> */}
                                        </div>

                                    <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                                        {/* <div className={this.state.section == 2 && this.state.showBack !== false || this.state.section == 4 && !this.state.showActionPlan || this.state.section == 5 && !this.state.showFeedback ? classes.greyBlock : ""}>{paragraphs}</div> */}
                                        {paragraphs}
                                        
                                        {this.state.msg && this.state.section <= 1 ? <p className={classes.error}>{litrals.errorMessage}</p> : ""}

                                        {radios && radios.length > 1 ? <Form className={classes.Form}> {radios} </Form> : ""}

                                        {/* <div style={{ width: "100%" }}>
                                        {this.state.section > 0 && this.state.showBack ? <CustomButton type="submit" float={"left"} onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton> : ""}
                                        {this.state.section < 2 ? <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : ""}
                                    </div> */}
                                        {this.state.showFeedback ? <CustomButton type="submit" float={"right"} width={mobile ? "100%" : ""} onClick={this.gotoFeedback} data={litrals.buttons.showFeedback}></CustomButton> : ""}

                                        {topic == 4 && this.state.showActionPlan ? (
                                            <div className={classes.downloadbtndiv} onClick={this.sendDownloadInfo}>
                                                <DropdownButton id="dropdown-item-button" title='Share Action Plan' bsPrefix={classes.buttonColor1} style={{ float: "left", width: "100%" }}>
                                                    <Dropdown.Item as="div" id={"whatsapp"} ><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool - Action Plan' url={this.state.data.answer} ><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon>WhatsApp</span></div></WhatsappShareButton></Dropdown.Item>
                                                </DropdownButton>
                                                {/* {downloadActionPlan} */}

                                                {/* <EmailShareButton  subject = 'Covid-19 Support Finder Tool Action Plan' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>
                            <CustomButton margin={"1rem 0 2rem 0"} type="submit" onClick={this.handleBack} data={litrals.buttons.shareOnWhatsapp}></CustomButton> */}
                                            </div>
                                        ) : ""}

                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </MenuProvider>
                :
                <div className={classes.backgrondImage}>
                    <Header heading={this.state.section} showHomeModal={this.showHomeModal} ></Header>
                    <ConfirmationModal modalFooter="dualButton" message={litrals.gotoHome} showModal={this.state.showHomeModal} onClick={this.gotoHome} onHide={this.closeHomeModal} />

                    <div className={classes.chatBotRow}>
                        <div className={classes.progressBar} >

                            {!this.state.disagree && <ProgressWeb section={this.state.section} showHomeModal={this.showHomeModal} ></ProgressWeb>}
                            { 

                            // this.state.section == 4 && this.state.showActionPlan  && !this.state.gotoNextJourney && questionStack[questionStack.length - 1]
                              this.state.selectedJourneys.length == 0 && this.state.section == 4 && this.state.showActionPlan  && !this.state.gotoNextJourney && questionStack[questionStack.length - 1] ? (
                                <div className={classes.downloadbtndiv} onClick={this.sendDownloadInfo}>
                                    {/* <span title="Download action plan"> {this.downloadActionPlan()}</span> */}

                                    { <Email emailData={this.emailData} handleWarning={this.handleWarning}></Email>}
                                    <ConfirmationModal message={litrals.warning} showModal={this.state.showWarningMessage} onClick={()=>this.setState({showWarningMessage:false, emailSent:true})} />

                                    {/* { <Warning warningData={this.showNoEmailWarninng}></Warning>} */}
                                    {/*<DropdownButton id="dropdown-item-button" title='Share Action Plan' bsPrefix={classes.buttonColor1} style={{ float: "left" }}>
                                                <Dropdown.Item as="div" id={"whatsapp"} ><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool - Action Plan' url={"https://covidsupportfindertool.z33.web.core.windows.net/" + "\n\n" + this.state.data.answer} ><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon>WhatsApp</span></div></WhatsappShareButton></Dropdown.Item>
                                                {/* <Dropdown.Item as="div" id={"email"} ><EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool - Action Plan' body={this.blobData} ><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon>Email</span></div></EmailShareButton></Dropdown.Item> </DropdownButton>*/}

                                    {/* <EmailShareButton  subject = 'Covid-19 Support Finder Tool Action Plan' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>
                                                <CustomButton margin={"1rem 0 2rem 0"} type="submit" onClick={this.handleBack} data={litrals.buttons.shareOnWhatsapp}></CustomButton> */}
                                </div>
                            ) : ""}


                        </div>
                        {this.state.queryIndex && this.state.currentJourney && !this.state.showNextJourney ? <p className={classes.currentJourneyTitle}>Finding support related to : <span className={classes.currentJourneySpan}>{this.state.currentJourney}</span></p> : null}

                        <div style={{ height: "calc(100% - 36px)", }} ref={this.myCustomHTML} id = "myCustomHTML1" className={classes.qnaContainer}>
                            <div style={{ display: this.state.showSpinner ? "block" : "none" }}>
                                <img alt="Loading...!!! " className={classes.spinner} src={loader}></img>
                                {/* <div>Loading...!!!</div> */}
                                </div>

                            <div style={{ display: this.state.showSpinner ? "none" : "block", height: "inherit", overflow: "auto", paddingBottom: "1vh" }}>
                                {/* <div className={this.state.section == 2 && this.state.showBack !== false || this.state.section == 4 && !this.state.showActionPlan || this.state.section == 5 && !this.state.showFeedback ? classes.greyBlock : ""}>{paragraphs}</div> */}
                                {paragraphs}
                                {/* {this.state.section <= 1 ? <p className={classes.message}>{litrals.optionText}</p> : ""} */}
                                {this.state.msg && this.state.section <= 1 ? <p className={classes.error}>{litrals.errorMessage}</p> : ""}

                                {radios && radios.length > 1 ? <Form className={this.state.section > 1 ? classes.Form : ""}> {radios} </Form> : ""}
                                {/* {!this.state.showNextJourney && this.state.section === 4 ? nextJourney : null} */}
                                {this.state.showTextArea === 1 ? <div> <h5 className={classes.heading}>Comments if any :</h5> <textarea className={classes.textInput} value={this.state.textAreaValue} onChange={this.onDisagreeTextAreaInput}></textarea> </div> : null}
                            </div>
                        </div>
                    </div>

                    <Footers format={true} buttonpanel={btn}></Footers>
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
        surveyData: data => dispatch(surveyData(data)),
        onCleanCreateJourney: data => dispatch(onCleanCreateJourney(""))
    };
};

const ChatbotData = connect(mapStateToProps, mapDispatchToProps)(Chatbot);

export default ChatbotData;
