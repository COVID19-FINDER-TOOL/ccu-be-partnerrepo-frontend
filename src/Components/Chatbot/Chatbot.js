import React, { useContext } from 'react'
import classes from './Chatbot.module.scss';
import { Form, Row, Col, Container } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import DownloadActionPlan from '../DownloadActionPlan/DownloadActionPlan';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { axiosInstance, axiosLoopbackInstance, axiosLoginInstance } from '../../AxiosHandler';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection, onCleanCreateJourney } from "../../store/Action/LoginAction";
import moment from "moment";
import { PDFDownloadLink, Document, Page, BlobProvider } from '@react-pdf/renderer'
import NavTabs from '../NavTabs/NavTabs';
import MDReactComponent from 'markdown-react-js';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Header from '../Header/Header';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import {
    EmailShareButton,
    WhatsappShareButton,

} from "react-share";
import ProgressWeb from '../ProgressWeb/ProgressWeb';

import MenuProvider from 'react-flexible-sliding-menu';
import ProgressMenu from '../ProgressWeb/ProgressMenu';
import Footers from '../Footers/Footers';
import { saveAs } from 'file-saver';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
class Chatbot extends React.Component {

    visitedLinks = [];
    key = -1;
    constructor(props) {
        super(props);
        this.blobData = null;
        this.blobUrl = ""
        this.state = {
            data: "",
            requestBody: { "question": "Start the flow" },
            msg: false,
            pdf: false,
            showBack: true,
            showFeedback: false,
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
            queryString: ["464251aa-1153-4743-95e3-91f755010d59/generateAnswer", '42f93d7a-e090-499d-9982-ef1542831f4c/generateAnswer', "e9699c3a-b42c-4dba-bdc7-c8209b88a1f1/generateAnswer", 'e6dfce19-14c2-4e29-8612-159a795f804a/generateAnswer', "0863232a-000d-4f17-91b9-b44666eb604c/generateAnswer"]
        }
    }

    componentDidMount = () => {
        this.props.onEditInspection({ questionStack: [], responseStack: [], metadata: "" })
        this.fetch();
        this.setPdf();

    }

    saveQuestion = (data, response, notFetch) => {
        var dataBody = {}
        var kb = data.metadata.find((x) => x.name === "idprefix") ? data.metadata.find((x) => x.name === "idprefix").value : "kb0";
        dataBody.question_id = kb.concat("q").concat(data.id.toString());
        dataBody.question = data.answer;
        dataBody.answers = data.context.prompts.map((x) => {
            return { aid: kb.concat("a").concat(x.qnaId.toString()), answer: x.displayText.toString() }
        })
        response.question_id = kb.concat("q").concat(response.question_id.toString())
        response.answer_id = kb.concat("a").concat(response.answer_id.toString())

        if (data.metadata.find((x) => x.name === "topic" && x.value != "1")) {
            this.fetch();
        }
        else {
            // console.log(this.state)
            this.state.section <= 1 ? this.saveInStorage(response) : console.log("Not Saving")
            // axiosLoginInstance.post("CFTQnAInsertTrigger/add", dataBody)
            //     .then(res => {
            //         const data = res.data;
            //         console.log(data);
            //     }).catch(error => {
            //         console.log(error);
            //     });
            console.log(this.state)
            notFetch ? console.log() : this.fetch();

        }
    }

    endJourney = () => {
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
                this.props.onEditInspection({
                    metadata: "",
                    questionStack: [],
                    responseStack: [],
                    journey_id: "",
                    start_time: ""
                })
                this.setState(() => {
                    return {
                        questionStack: [],
                        responseStack: [],
                        backStack: [],
                        metadata: ""
                    }
                })
            }).catch(error => {
                console.log(error);
            });
    }

    fetch = (str) => {
        console.log(this.state, str)
        const body = str ? str.body : this.state.requestBody
        this.setState(() => { return { showSpinner: true, questionStack: str ? this.state.questionStack : this.state.questionStack.concat({ body }) } })
        axiosInstance.post(str ? str.query : this.state.queryString[this.state.queryIndex], body)
            .then(res => {
                const data = res.data.answers[0];
                const section = data.metadata[1] ? Number(data.metadata[1].value) : body.question == "Start the flow" ? 0 : this.state.section
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
            const { questionStack, data } = this.state;

            this.props.onEditInspection({ questionStack })
        }
    }

    handleRadio = (event) => {
        // console.log(event.target)
        // console.log("IN RADIO")
        // event.preventDefault();
        const { CREATEJOURNEY } = this.props.payload;
        const value = event.target.value
        const id = event.target.id
        const currentResponses = { value, id }
        this.state.section < 2 ? this.setState(() => { return { currentResponses, selected: true, msg: false } }) : this.setState(() => { return { currentResponses, selected: true, msg: false } }, () => { this.handleSubmit() })


    }

    handleSubmit = () => {
        const { CREATEJOURNEY } = this.props.payload
        var { journey_id, start_time } = CREATEJOURNEY ? CREATEJOURNEY : ""
        var { responseStack, backStack } = CREATEJOURNEY ? CREATEJOURNEY : []
        const currentResponse = backStack ? backStack[backStack.length - 1] : ""
        const state_data = this.state.data

        if (this.state.selected || currentResponse) {
            var value = ""
            var id = ""

            if (this.state.currentResponses.value) {
                value = this.state.currentResponses.value
                id = this.state.currentResponses.id
            }
            else {
                value = currentResponse.descriptive_answer
                id = currentResponse.answer_id.toString().substring(4)
            }
            var requestBody = {}
            const resbody = {
                "question_id": this.state.data.id,
                "answer_id": id ? id : "",
                "answer_time": moment.utc().format('YYYY-MM-DD hh:mm:ss'),
                "descriptive_answer": value,
            }
            // console.log(currentResponse)
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
            this.setState(()=>{return{backStack}})


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
                    this.setState(() => { return { requestBody, selected: false } }, ()=>{this.fetch()});

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
                let meta = metadata && metadata[0] ? metadata[0].value : ""
                meta = meta + value.replace(/ /g, '').slice(0, 3).toLowerCase()
                // console.log(">>>>>>>>>>>",meta)
                this.props.onEditInspection({ metadata: meta })
                requestBody = {
                    "question": value,
                    "top": 1,
                    "strictFilters": [{ "name": "context", "value": meta }]
                };

                if (this.state.section == 4 || (this.state.queryIndex == 4 && this.state.section == 2)) {
                    const metadata_ = CREATEJOURNEY.metadata
                    // console.log(metadata_, this.state.metadata)
                    if (value == "Next") {
                        requestBody = {
                            "question": "loopback"
                        };
                        this.setState(() => { return { showBack: false } })
                        this.endJourney();

                    }

                    else if (value == "Yes" && meta === "loonoyes" || value == "Yes" && meta === "cornexnoyes") {
                        // console.log("To Hear from others", metadata_)
                        this.setState(() => { return { section: this.state.section + 1, showFeedback: true } })
                    }

                    else if (value == "No" && meta === "loonono" || value == "No" && meta === "cornexnono") {

                        //console.log("Inside loopback")
                        this.props.history.push("/feedback")
                    }

                    else if (value == "Yes" && meta !== "loonoyes") {
                        // console.log("to loopback", metadata_)
                        this.visitedLinks = []
                        this.setState(() => { return { queryIndex: 0, section: 0, showActionPlan: false, showBack: true, visitedLinks: [] } })
                        requestBody = {
                            "question": "Start the flow",
                        };

                    }

                }
                this.setState(() => { return { requestBody, selected: false, currentResponses: {} } }, () => { this.saveQuestion(this.state.data, resbody, false) });

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




        // this.setState(() => { return { showSpinner: true } });


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

                        return (loading ? "Loading document..." : "Download Action Plan")
                    }

                }
            </PDFDownloadLink>
        )
    }

    shareActionPlan = () => {
        const { CREATEJOURNEY } = this.props.payload
        const { responseStack } = CREATEJOURNEY ? CREATEJOURNEY : []

        return (
            <BlobProvider onClick={this.sendDownloadInfo} document={<DownloadActionPlan data={this.state.data.answer} summary={responseStack} />}>
                {({ blob, url, loading, error }) => {
                    console.log(blob)
                }}
            </BlobProvider>
        )
    }

    setPdf = () => {
        this.setState({ pdf: true })
    }

    createForm = (prompts, id) => {
        const { CREATEJOURNEY } = this.props.payload;
        const { backStack } = CREATEJOURNEY ? CREATEJOURNEY : [];
        var res = ""
        if (backStack) {
            res = backStack.find(x => x.question_id.toString().substring(4) == id && x.question_id.toString()[2] == this.state.queryIndex)
        }

        if (prompts.length == 1) {
            const data = {
                buttonText: prompts[0].displayText,
                variant: "primary",
            }
            return [<div id={prompts[0].qnaId} key={prompts[0].qnaId} name={id} onClick={this.handleRadio}><CustomButton float={"right"} data={data} id={prompts[0].qnaId} key={prompts[0].qnaId} name={id} onClick={this.handleRadio}></CustomButton></div>]
        }
        else {
            const radios = prompts.map((x, index) => {
                const checked = res && (x.qnaId == res.answer_id.toString().substring(4)) && (x.displayText == res.descriptive_answer) ? "checked" : false
                // console.log(checked, res)
                return (
                    <CustomRadio radioLabel={x.displayText} display={this.state.section == 4 && !this.state.showActionPlan ? false : true} btn={(x.displayText == "Next" || x.displayText == "Action Plan") ? true : ""} width={x.displayText == "Next" ? "7rem" : x.displayText == "Action Plan" ? "10rem" : ""} id={x.qnaId} key={x.qnaId} name={id} onClick={this.handleRadio} checked={checked} />
                )
            })
            return (radios);
        }
    }

    handleBack = () => {
        if (this.state.showActionPlan) {
            this.setState(() => {
                return { showActionPlan: false }
            })
        }
        else {
            const { CREATEJOURNEY } = this.props.payload
            var { backStack } = this.state
            const { metadata, responseStack, questionStack, section } = CREATEJOURNEY ? CREATEJOURNEY : "";
            const previousResponse = responseStack[responseStack.length - 1];
            const exists = backStack ? backStack.find((x)=>x.answer_id == previousResponse.answer_id) : false
            if (section < 3 && !exists) {
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

            this.setState(() => { return { currentResponses:{}, backStack, requestBody, queryIndex, questionStack: questionStack.slice(0, questionStack.length - 1) } }, () => { this.fetch() })

        }

    }



    handleIterate = (Tag, props, children, level) => {


        if (Tag === 'h4' || Tag === 'h3' || Tag === 'h2') {
            props = {
                ...props,
                className: classes.heading
            };
        }


        if (Tag === 'p') {
            props = {
                ...props,
                className: classes.para
            };
        }

        if (Tag === 'ol') {
            props = {
                ...props,
                className: this.state.data.metadata[1] ? this.state.data.metadata[1].value == 4 ? classes.bullets : "" : ""
            };
        }

        if (Tag === 'a') {
            props = {
                ...props,
                className: classes.linkElement,
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
        const textarray = text.split("\n");
        // console.log(textarray)
        var texts = [];
        var links = [];
        var visitedLinks = [];
        if (topic == 4) {
            textarray.map((x) => {
                if (x.match(/^\d/)) {
                    links.push(x)
                    visitedLinks.push(false)

                } else {
                    texts.push(x)
                }
                this.visitedLinks = visitedLinks
            })
            return (
                <>
                    <div style={{ display: !this.state.showActionPlan ? "block" : "none" }}>
                        {
                            texts.map((x) => {
                                return <MDReactComponent text={x} onIterate={this.handleIterate} />

                            })
                        }
                        {/* <CustomButton margin={"5rem 0 0 0"} type="submit" float={"right"} onClick={this.showActionPlan} data={litrals.buttons.viewActionPlan}></CustomButton> */}
                    </div>
                    <div className={classes.actionPlanFlex} style={{ display: this.state.showActionPlan ? "block" : "none" }}>
                        <p className={classes.actionPlanPara}>{litrals.actionPlanPara1}<br></br>{litrals.actionPlanPara2}</p>
                        <div className={classes.actionPlanFlex} >
                            {
                                links.map((x, index) => {
                                    this.key = index

                                    return (
                                        <div className={classes.actionPlanLinks}>
                                            <div md={11} xs={10} className={classes.linkSpan}><MDReactComponent text={x} onIterate={this.handleIterate} /></div>
                                            <span className={classes.verticalLine}></span>
                                            <div md={1} xs={2} className={classes.iconCenter}> <span className={this.state.visitedLinks && this.state.visitedLinks[index] ? classes.linkSpanContentChecked : classes.linkSpanContent}></span></div>
                                        </div>)
                                })
                            }
                        </div>
                    </div>
                </>
            )
        }
        else {
            return <MDReactComponent text={text} onIterate={this.handleIterate} />
        }

    }

    showActionPlan = () => {
        this.setState({ showActionPlan: true })
    }

    displayNextTopic = (topic) => {

        const text = this.state.data.answer;
        const textarray = text.split("\n");
        var temp = {}
        var count = 0
        var key = ""
        textarray.map((x) => {
            if (/^\d/.test(x.trim())) {
                key = x
            }
            else {
                temp[key] ? temp[key].push(x.trim()) : temp[key] = [x.trim()]
            }
        })
        return <NavTabs data={temp} topic={topic}></NavTabs>

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

    callHearFromOthers = () => {

        const str = {
            "body": { "question": "hear from others" },
            "query": this.state.queryString[0]
        }
        this.fetch(str)

    }

    imageSelector = (section) => {
        switch (section) {
            case 0: { return "tell_uss.png"; break; }
            case 1: { return "tell_uss.png"; break; }
            case 2: { return "Hear_from_other.png"; break; }
            case 3: { return "Hear_from_other.png"; break; }
            case 4: { return "Action_Plan.png"; break; }
            case 5: { return "Hear_from_other.png"; break; }
            default: { return "Action Plan.png"; break; }

        }

    }

    showHomeModal = () => {
        this.setState(() => { return { showHomeModal: true } })
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

    render() {
        const topic = this.state.data.metadata ? this.state.data.metadata[1] ? this.state.data.metadata[1].value : 0 : 0;
        const paragraphs = this.state.data ? topic == 3 || topic == 5 || this.state.showHearFromOthers ? this.displayNextTopic(topic) : this.splitQuestionData(topic) : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts, this.state.data.id) : console.log()
        const downloadActionPlan = this.downloadActionPlan();
        const mobile = window.matchMedia("(max-width: 600px)").matches;
        const imageSelector = this.imageSelector(this.state.section)
        // this.props.onEditInspection({topic})
        return (

            mobile ?
                <MenuProvider width={"287px"} MenuComponent={ProgressMenu}>
                    <div style={{ backgroundImage: `url(${require("../../assets/Images/" + imageSelector)})` }} className={classes.backgrondImage}>
                        <Header heading={this.state.section} loading={this.state.showSpinner} handleBack={this.handleBack} handleSubmit={this.handleSubmit} showBack={this.state.showBack} dynamicOptions={radios} CustomButton={topic == 4 && !this.state.showActionPlan ? this.showActionPlan : ""}></Header>
                        <Container>
                            <Row className={classes.chatBotRow}>
                                <Col md={4} xs={1} style={{ padding: "0" }}>
                                    <ProgressWeb section={this.state.section} callHearFromOthers={this.callHearFromOthers} ></ProgressWeb>
                                </Col>
                                <Col md={8} xs={11}>
                                    <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.svg")}></img></div>

                                    <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                                        {paragraphs}
                                        {this.state.msg ? <p className={classes.error}>*Please select an option</p> : ""}

                                        {radios && radios.length > 1 ? <Form className={classes.Form}> {radios} </Form> : ""}

                                        {/* <div style={{ width: "100%" }}>
                                        {this.state.section > 0 && this.state.showBack ? <CustomButton type="submit" float={"left"} onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton> : ""}
                                        {this.state.section < 2 ? <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : ""}
                                    </div> */}
                                        {this.state.showFeedback ? <CustomButton type="submit" float={"right"} width={mobile?"100%":""} onClick={this.gotoFeedback} data={litrals.buttons.showFeedback}></CustomButton> : ""}

                                        {topic == 4 && this.state.showActionPlan ? (
                                            <div className={classes.downloadbtndiv} onClick={this.sendDownloadInfo}>
                                                <DropdownButton id="dropdown-item-button" title='Share Action Plan' bsPrefix={classes.buttonColor1} style={{ float: "left", width:"100%" }}>
                                                    <Dropdown.Item as="div" id={"whatsapp"} ><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool - Action Plan' url={this.state.data.answer} ><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon>WhatsApp</span></div></WhatsappShareButton></Dropdown.Item>
                                                </DropdownButton>
                                                {downloadActionPlan}

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
                <div style={{ backgroundImage: `url(${require("../../assets/Images/" + imageSelector)})` }} className={classes.backgrondImage}>
                    <Header heading={this.state.section} loading={this.state.showSpinner} handleBack={this.handleBack} handleSubmit={this.handleSubmit} showBack={this.state.showBack} dynamicOptions={radios} CustomButton={topic == 4 && !this.state.showActionPlan ? this.showActionPlan : ""}></Header>
                    <ConfirmationModal modalFooter="dualButton" message={litrals.gotoHome} showModal={this.state.showHomeModal} onClick={this.gotoHome} onHide={this.closeHomeModal} />
                    <Container>
                        <Row className={classes.chatBotRow}>
                            <Col md={4} xs={1} style={{ padding: "0" }}>
                                <p className={classes.logoPara}>
                                    <img
                                        alt="SSlogo"
                                        src={require("../../assets/Images/Support_finder_logo.png")}
                                        width="50"
                                        style={{ marginRight: "1.2rem", cursor: "pointer", "box-boxShadow": "0px 3px 6px #00000029" }}
                                        onClick={this.showHomeModal}
                                    />Support Finder</p>
                                <ProgressWeb section={this.state.section} callHearFromOthers={this.callHearFromOthers}></ProgressWeb>
                                <Footers></Footers>
                            </Col>
                            <Col md={8} xs={11}>
                                <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.svg")}></img></div>

                                <div style={{ display: this.state.showSpinner ? "none" : "block" }}>

                                    {paragraphs}
                                    {this.state.msg ? <p className={classes.error}>*Please select an option</p> : ""}

                                    {radios && radios.length > 1 ? <Form className={classes.Form}> {radios} </Form> : ""}

                                    <div style={{ width: "100%" }}>
                                        {/* {this.state.section > 0 && this.state.showBack ? <CustomButton type="submit" float={"left"} onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton> : ""}
                                        {this.state.section < 2 ? <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : ""} */}
                                        {this.state.showFeedback ? <CustomButton type="submit" float={"right"} width={mobile?"100%":""} onClick={this.gotoFeedback} data={litrals.buttons.showFeedback}></CustomButton> : ""}

                                    </div>
                                    {topic == 4 && this.state.showActionPlan ? (
                                        <div className={classes.downloadbtndiv} onClick={this.sendDownloadInfo}>
                                            {downloadActionPlan}
                                            <DropdownButton id="dropdown-item-button" title='Share Action Plan' bsPrefix={classes.buttonColor1} style={{ float: "left" }}>
                                                <Dropdown.Item as="div" id={"whatsapp"} ><WhatsappShareButton id={"whatsapp"} title='Covid-19 Support Finder Tool - Action Plan' url={"https://covidsupportfindertool.z33.web.core.windows.net/" + "\n\n" + this.state.data.answer} ><div id={"whatsapp"} className={classes.iconsbar}><span id={"whatsapp"} className={classes.linkElement}><WhatsAppIcon id={"whatsapp"} fontSize="large" className={classes.linkElement}></WhatsAppIcon>WhatsApp</span></div></WhatsappShareButton></Dropdown.Item>
                                                {/* <Dropdown.Item as="div" id={"email"} ><EmailShareButton id={"email"} subject='Covid-19 Support Finder Tool - Action Plan' body={this.blobData} ><div id={"email"} className={classes.iconsbar}><span id={"email"} className={classes.linkElement}><MailIcon id={"email"} fontSize="large" className={classes.linkElement}></MailIcon>Email</span></div></EmailShareButton></Dropdown.Item> */}
                                            </DropdownButton>

                                            {/* <EmailShareButton  subject = 'Covid-19 Support Finder Tool Action Plan' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>
                                                <CustomButton margin={"1rem 0 2rem 0"} type="submit" onClick={this.handleBack} data={litrals.buttons.shareOnWhatsapp}></CustomButton> */}
                                        </div>
                                    ) : ""}

                                </div>

                            </Col>
                        </Row>
                    </Container>
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
