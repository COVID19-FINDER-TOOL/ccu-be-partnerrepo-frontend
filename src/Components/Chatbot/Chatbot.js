import React, { useContext } from 'react'
import classes from './Chatbot.module.scss';
import { Form, Row, Col } from 'react-bootstrap';
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
import {
    EmailShareButton,
    WhatsappShareButton,

} from "react-share";
import ProgressWeb from '../ProgressWeb/ProgressWeb';

import MenuProvider from 'react-flexible-sliding-menu';
import ProgressMenu from '../ProgressWeb/ProgressMenu';
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
            change: false,
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
            // this.saveInStorage(response)
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

    fetch = () => {
        const body = this.state.requestBody
        this.setState(() => { return { showSpinner: true, questionStack: this.state.questionStack.concat({ body }) } })
        axiosInstance.post(this.state.queryString[this.state.queryIndex], this.state.requestBody)
            .then(res => {
                const data = res.data.answers[0];
                const section = data.metadata[1] ? Number(data.metadata[1].value) : 1
                if (data.id === -1) {
                    this.props.onEditInspection({
                        responseStack: [],
                        questionStack: [],
                        metadata: "",

                    })
                    this.props.history.push("/feedback")
                }
                this.props.onEditInspection({ section })
                this.setState(() => { return { data: data, showSpinner: false } });
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { showSpinner: false } })
            });
        const { questionStack, data } = this.state;

        this.props.onEditInspection({ questionStack })
    }


    handleRadio = (event) => {
        const value = event.target.value
        const queryIndex = event.target.name
        const id = event.target.id
        const type = event.target.type
        console.log(value, id)
        var requestBody = {}



        if (this.state.queryIndex === 0) {
            var nextques = "" //? this.setState(()=>{return{queryIndex}}): console.log();
            console.log(queryIndex)
            if (queryIndex == 1) {
                nextques = "Flow started"
            }
            else {
                nextques = "Flow Started"
            }
            // switch (queryIndex) {
            //     case 1: { nextques = "Work flow started"; break; }
            //     case 2: { nextques = "Money Flow Started"; break; }
            //     case 3: { nextques = "Mental Health Flow Started"; break; }
            //     case 4: { nextques = "Work flow started"; break; }
            //     default: { nextques = "Work flow started"; break; }
            // }
            requestBody = { "question": nextques };
            const journey_id = "JID" + moment.utc().format('DDMMYYThhmmssSSS');
            console.log(requestBody, journey_id)

            this.setState(() => { return { queryIndex: queryIndex } });

        }
        else {
            const { metadata } = this.state.data
            let meta = metadata[0].value
            meta = meta + value.slice(0, 3).toLowerCase()
            this.props.onEditInspection({ metadata: meta })
            requestBody = {
                "question": value,
                "top": 1,
                "strictFilters": [{ "name": "context", "value": meta }]
            };

        }
        const resbody = {
            "question_id": this.state.data.id,
            "answer_id": id ? id : "",
            "answer_time": moment.utc().format('YYYY-MM-DD hh:mm:ss'),
            "descriptive_answer": value,
            // "topic": this.state.data.metadata[1] ? this.state.data.metadata[1].value : 0
        }
        const { CREATEJOURNEY } = this.props.payload;
        var { responseStack } = CREATEJOURNEY ? CREATEJOURNEY : [];
        responseStack = responseStack.concat(resbody)
        console.log(responseStack, resbody)

        this.props.onEditInspection({ responseStack: responseStack })
        this.setState(() => { return { requestBody } }, () => { this.saveQuestion(this.state.data, resbody) });


    }

    saveInStorage = (user_response) => {
        const { LOGIN } = this.props.payload;
        const { user } = LOGIN ? LOGIN : ''
        const { user_id } = user ? user : JSON.parse(window.localStorage.getItem("csf_user"));
        user_response["user_id"] = user_id;
        user_response["topic_id"] = Number(this.state.queryIndex);


        this.setState(() => { return { showSpinner: true } });


        axiosLoginInstance.post("CFTUserJourneyTrigger/answer", user_response)
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
            res = responseStack.find((x) => {
                return x.question_id == id
            })
        }

        const radios = prompts.map((x, index) => {
            const checked = res && x.qnaId == res.answer_id.substring(3) ? "cheched" : ''
            // console.log(checked, res ? res.answer_id.substring(3):"")
            return (
                <CustomRadio radioLabel={x.displayText} margin={(x.displayText == "Next" || x.displayText == "Action Plan") ? true : ""} width={x.displayText == "Next" ? "7rem" : x.displayText == "Action Plan" ? "10rem" : ""} id={x.qnaId} key={x.qnaId} name={id} checked={checked} onClick={this.handleRadio} />
            )
        })
        return (radios);

    }

    handleBack = () => {
        const { CREATEJOURNEY } = this.props.payload
        const { metadata, responseStack, questionStack } = CREATEJOURNEY ? CREATEJOURNEY : "";
        const previousResponse = responseStack[responseStack.length - 1];
        const previousquestion = questionStack[questionStack.length - 1];
        const newMeta = previousquestion ? previousquestion.body.strictFilters ? previousquestion.body.strictFilters[0].value : { "question": "Start the flow" } : { "question": "Start the flow" }
        const newQueStk = questionStack.slice(0, questionStack.length)
        console.log(newQueStk, questionStack)
        this.props.onEditInspection({ metadata: newMeta, questionStack: newQueStk })
        this.setState(() => { return { requestBody: previousquestion ? previousquestion.body : { "question": "Start the flow" }, queryIndex: previousquestion ? this.state.queryIndex : 0, questionStack: questionStack.slice(0, questionStack.length - 1) } }, () => { this.fetch() })

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
                        <CustomButton type="submit" float={"right"} onClick={this.showActionPlan} data={litrals.buttons.viewActionPlan}></CustomButton>
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
        console.log(topic)
        const paragraphs = this.state.data ? topic == 3 ? this.displayNextTopic(topic) : this.splitQuestionData(topic) : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts, this.state.data.id) : console.log()
        const downloadActionPlan = this.downloadActionPlan();
        const mobile = window.matchMedia("(max-width: 600px)").matches;
        console.log(mobile)
        return (

            mobile ? 
            <MenuProvider width = {"287px"} MenuComponent={ProgressMenu}>
                <Row>
                    <Col md={4} xs={1} style={{padding:"0"}}>
                        <ProgressWeb section={topic}></ProgressWeb>
                    </Col>
                    <Col md={8} xs={11}>
                        <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>

                        <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                            {paragraphs}
                            <Form>
                                {radios ? radios : ""}

                            </Form>
                            <div style={{ width: "100%" }}>
                                <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton>
                                {/* <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> */}
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
            </MenuProvider>
            :
            <Row>
                    <Col md={4} xs={1} style={{padding:"0"}}>
                        <ProgressWeb section={topic}></ProgressWeb>
                    </Col>
                    <Col md={8} xs={11}>
                        <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>

                        <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                            {paragraphs}
                            <Form>
                                {radios ? radios : ""}

                            </Form>
                            <div style={{ width: "100%" }}>
                                <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton>
                                {/* <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> */}
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
