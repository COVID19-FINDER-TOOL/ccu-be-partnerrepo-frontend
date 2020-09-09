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
import { onEditInspection } from "../../store/Action/LoginAction";
import moment from "moment";
import { PDFDownloadLink, Document, Page, PDFViewer } from '@react-pdf/renderer'
import NavTabs from '../NavTabs/NavTabs';
import MDReactComponent from 'markdown-react-js';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Header from '../Header/Header';

import {
    EmailShareButton,
    WhatsappShareButton,

} from "react-share";
import ProgressWeb from '../ProgressWeb/ProgressWeb';

import MenuProvider from 'react-flexible-sliding-menu';
import ProgressMenu from '../ProgressWeb/ProgressMenu';
import Footers from '../Footers/Footers';
class Chatbot extends React.Component {

    visitedLinks = [];
    key = -1;
    constructor(props) {
        super(props);

        this.state = {
            data: "",
            requestBody: { "question": "Start the flow" },
            msg: false,
            pdf: false,
            condition: "",
            showSpinner: true,
            metadata: "",
            topicId: 1,
            questionStack: [],
            responseStack: [],
            backStack: [],
            change: false,
            section: 0,
            queryIndex: 0,
            queryString: ["464251aa-1153-4743-95e3-91f755010d59/generateAnswer", '42f93d7a-e090-499d-9982-ef1542831f4c/generateAnswer', "e9699c3a-b42c-4dba-bdc7-c8209b88a1f1/generateAnswer", 'e6dfce19-14c2-4e29-8612-159a795f804a/generateAnswer']
        }
    }

    componentDidMount = () => {
        this.props.onEditInspection({ questionStack: [], responseStack: [], metadata: "" })
        this.fetch();
        this.setPdf();

    }

    saveQuestion = (data, response) => {
        var dataBody = {}
        var kb = data.metadata.find((x) => x.name === "idprefix") ? data.metadata.find((x) => x.name === "idprefix").value : "kb0";
        dataBody.question_id = kb.concat("q").concat(data.id.toString());
        dataBody.question = data.answer;
        dataBody.answers = data.context.prompts.map((x) => {
            return { aid: kb.concat("a").concat(x.qnaId.toString()), answer: x.displayText.toString() }
        })
        response.question_id = kb.concat("q").concat(response.question_id.toString())
        response.answer_id = kb.concat("a").concat(response.answer_id.toString())

        console.log(response)
        if (data.metadata.find((x) => x.name === "topic" && x.value != "1")) {
            this.fetch();
        }
        else {
            console.log(this.state)
            this.state.section <= 1 ? this.saveInStorage(response) : console.log("Not Saving")
            // axiosLoginInstance.post("CFTQnAInsertTrigger/add", dataBody)
            //     .then(res => {
            //         const data = res.data;
            //         console.log(data);
            //         this.fetch();
            //     }).catch(error => {
            //         console.log(error);
            //     });
            this.fetch();

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
                this.fetch();
            }).catch(error => {
                console.log(error);
            });
    }

    fetch = () => {
        const body = this.state.requestBody
        this.setState(() => { return { showSpinner: true, questionStack: this.state.questionStack.concat({ body }) } })
        axiosInstance.post(this.state.queryString[this.state.queryIndex], body)
            .then(res => {
                const data = res.data.answers[0];
                const section = data.metadata[1] ? Number(data.metadata[1].value) : this.state.section
                if (data.id === -1) {
                    this.props.onEditInspection({
                        responseStack: [],
                        questionStack: [],
                        metadata: "",

                    })
                    this.props.history.push("/feedback")
                }
                this.props.onEditInspection({ section })
                this.setState(() => { return { data: data, showSpinner: false, section: section } });
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { showSpinner: false } })
            });
        const { questionStack, data } = this.state;

        this.props.onEditInspection({ questionStack })
    }


    handleRadio = (event) => {
        const { CREATEJOURNEY } = this.props.payload;
        const value = event.target.value
        const queryIndex = event.target.name
        const id = event.target.id
        const type = event.target.type
        var requestBody = {}

        console.log(150, value, queryIndex, id, type, event.target)


        if (this.state.queryIndex === 0) {

            var nextques = "Flow Started" 
            requestBody = { "question": nextques };
            const journey_id = "JID" + moment.utc().format('DDMMYYThhmmssSSS');
            const startTime = moment.utc().format('YYYY-MM-DD hh:mm:ss')
            this.props.onEditInspection({ journey_id })
            const dataBody = {

                "journey_id": journey_id,
                "started": 1,
                "start_time": startTime
            }
            axiosLoginInstance.post("/CFTJourneyUpdateTrigger/add", dataBody)
                .then(res => {
                    const data = res.data;
                    console.log(data);
                    // this.fetch();
                }).catch(error => {
                    console.log(error);
                });
            this.setState(() => { return { queryIndex: id-1 } });


        }
        else {
            const { metadata } = this.state.data
            let meta = metadata[0].value
            meta = meta + value.replace(/ /g, '').slice(0, 3).toLowerCase()
            this.props.onEditInspection({ metadata: meta })
            requestBody = {
                "question": value,
                "top": 1,
                "strictFilters": [{ "name": "context", "value": meta }]
            };

            if (this.state.section == 4) {
                const metadata_ = CREATEJOURNEY.metadata
                console.log(metadata_)
                if (value == "Next") {
                    requestBody = {
                        "question": "loopback"
                    };
                    this.endJourney();
                }
                else if (value == "Yes" && metadata_ !== "loono") {
                    this.setState({ queryIndex: 0, section: 0 })
                    requestBody = {
                        "question": "Start the flow",
                    };
                }
                else if (value == "Yes" && metadata_ === "loono") {
                    this.setState({ section: this.state.section + 1 })
                }
                else if (value == "No" && metadata_ === "loono") {
                    this.props.history.push("/feedback")
                }

            }



        }
        const resbody = {
            "question_id": this.state.data.id,
            "answer_id": id ? id : "",
            "answer_time": moment.utc().format('YYYY-MM-DD hh:mm:ss'),
            "descriptive_answer": value,
            // "topic": this.state.data.metadata[1] ? this.state.data.metadata[1].value : 0
        }

        var { responseStack } = CREATEJOURNEY ? CREATEJOURNEY : [];
        console.log(resbody)
        responseStack = responseStack.concat(resbody)
        // console.log(responseStack, resbody)

        this.props.onEditInspection({ responseStack: responseStack })
        this.setState(() => { return { requestBody } }, () => { this.saveQuestion(this.state.data, resbody) });
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
        responseBody["event_changed"] = "False";
        responseBody["answered"] = []



        this.setState(() => { return { showSpinner: true } });


        axiosLoginInstance.post("CFTUserJourneyTrigger/answer", responseBody)
            .then(res => {
                const data = res.data;
                console.log(data);
                // this.fetch();
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { showSpinner: false } })

            });
    }

    handleSubmit = () => {

    }

    downloadActionPlan = () => {
        const { CREATEJOURNEY } = this.props.payload
        const { responseStack } = CREATEJOURNEY ? CREATEJOURNEY : []
        return (

            <PDFDownloadLink
                document={<DownloadActionPlan data={this.state.data.answer} summary={responseStack} />}
                fileName="ActionPlan.pdf"
                className={classes.buttonColor1}
            >
                {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : "Download Action Plan"
                }
            </PDFDownloadLink>



        )
    }

    setPdf = () => {
        this.setState({ pdf: true })
    }

    createForm = (prompts, id) => {
        const { CREATEJOURNEY } = this.props.payload;
        const { responseStack } = CREATEJOURNEY ? CREATEJOURNEY : [];
        var res = ""
        if (responseStack) {
            res = responseStack.find(x => x.question_id.toString().substring(4) == id)
        }

        const radios = prompts.map((x, index) => {
            // const checked = res && (x.qnaId  == res.answer_id.toString().substring(4)) && (x.displayText == res.descriptive_answer) ? "checked" : false
            // console.log(checked, res)
            return (
                <CustomRadio radioLabel={x.displayText} display={this.state.section == 4 && !this.state.showActionPlan ? false : true} margin={(x.displayText == "Next" || x.displayText == "Action Plan") ? true : ""} width={x.displayText == "Next" ? "7rem" : x.displayText == "Action Plan" ? "10rem" : ""} id={x.qnaId} key={x.qnaId} name={id} onClick={this.handleRadio} />
            )
        })
        return (radios);

    }

    handleBack = () => {
        const { CREATEJOURNEY } = this.props.payload
        const { backStack } = this.state
        const { metadata, responseStack, questionStack } = CREATEJOURNEY ? CREATEJOURNEY : "";
        const previousResponse = responseStack[responseStack.length - 1];
        backStack.push([previousResponse])
        const previousquestion = questionStack[questionStack.length - 1];
        const newMeta = previousquestion ? previousquestion.body.strictFilters ? previousquestion.body.strictFilters[0].value : { "question": "Start the flow" } : { "question": "Start the flow" }
        const newQueStk = questionStack.slice(0, questionStack.length)
        const newResStk = responseStack.slice(0, responseStack.length - 1)
        this.props.onEditInspection({ metadata: newMeta, questionStack: newQueStk, responseStack: newResStk })
        console.log(newQueStk, newResStk, backStack)
        this.setState(() => { return { backStack, requestBody: previousquestion ? previousquestion.body : { "question": "Start the flow" }, queryIndex: previousquestion ? this.state.queryIndex : 0, questionStack: questionStack.slice(0, questionStack.length - 1) } }, () => { this.fetch() })



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
                        <CustomButton margin={"5rem 0 0 0"} type="submit" float={"right"} onClick={this.showActionPlan} data={litrals.buttons.viewActionPlan}></CustomButton>
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
        if (topic == 3) {
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
            return <NavTabs data={temp}></NavTabs>
        }
    }

    render() {
        const topic = this.state.data.metadata ? this.state.data.metadata[1] ? this.state.data.metadata[1].value : 0 : 0;
        const paragraphs = this.state.data ? topic == 3 ? this.displayNextTopic(topic) : this.splitQuestionData(topic) : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts, this.state.data.id) : console.log()
        const downloadActionPlan = this.downloadActionPlan();
        const mobile = window.matchMedia("(max-width: 600px)").matches;
        return (

            mobile ?
                <MenuProvider width={"287px"} MenuComponent={ProgressMenu}>
                    <Header heading={this.state.section}></Header>
                    <Container>
                        <Row className={classes.chatBotRow}>
                            <Col md={4} xs={1} style={{ padding: "0" }}>
                                <ProgressWeb section={this.state.section}></ProgressWeb>
                            </Col>
                            <Col md={8} xs={11}>
                                <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>

                                <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                                    {paragraphs}
                                    <Form className={classes.Form}>
                                        {radios ? radios : ""}

                                    </Form>
                                    <div style={{ width: "100%" }}>
                                        <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton>
                                        {this.state.section <2 ? <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : ""}
                                    </div>
                                    {topic == 4 && this.state.showActionPlan ? (
                                        <div className={classes.downloadbtndiv}>
                                            {downloadActionPlan}
                                            {/* <EmailShareButton  subject = 'Covid-19 Support Finder Tool Action Plan' url={"https://covidsupportfindertool.z33.web.core.windows.net/"}><MailIcon fontSize="large" className={classes.linkElement}></MailIcon></EmailShareButton>
                            <CustomButton margin={"1rem 0 2rem 0"} type="submit" onClick={this.handleBack} data={litrals.buttons.shareOnWhatsapp}></CustomButton> */}
                                        </div>
                                    ) : ""}

                                </div>

                            </Col>
                        </Row>
                    </Container>
                </MenuProvider>
                :
                <div>
                    <Header heading={this.state.section}></Header>
                    <Container>
                        <Row className={classes.chatBotRow}>
                            <Col md={4} xs={1} style={{ padding: "0" }}>
                                <p className={classes.logoPara}>
                                    <img
                                        alt="SSlogo"
                                        src={require("../../assets/Images/logoSmall.png")}
                                        width="50"
                                    />Support Finder</p>
                                <ProgressWeb section={this.state.section}></ProgressWeb>
                                <Footers></Footers>
                            </Col>
                            <Col md={8} xs={11}>
                                <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>

                                <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                                    {paragraphs}
                                    <Form className={classes.Form}>
                                        {radios ? radios : ""}

                                    </Form>
                                    <div style={{ width: "100%" }}>
                                        <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton>
                                        {this.state.section <2 ? <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> : ""}

                                    </div>
                                    {topic == 4 && this.state.showActionPlan ? (
                                        <div className={classes.downloadbtndiv}>
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

const ChatbotData = connect(mapStateToProps, mapDispatchToProps)(Chatbot);

export default ChatbotData;
