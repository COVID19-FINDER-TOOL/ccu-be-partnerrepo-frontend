import React from 'react'
import classes from './Chatbot.module.css';
import { Form } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import DownloadActionPlan from '../DownloadActionPlan/DownloadActionPlan';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { axiosInstance, axiosLoopbackInstance } from '../../AxiosHandler';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import moment from "moment";
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'


class Chatbot extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: "",
            requestBody: { "question": "Yes" },
            msg: false,
            condition: "",
            showSpinner: true,
            metadata: "",
            topicId: -1,
            questionStack: [],
            responseStack: [],
            change: false
        }
    }

    componentDidMount = () => {
        this.props.onEditInspection({ questionStack: [], responseStack: [], metadata: "" })
        this.fetch();


    }

    fetch = () => {
        const body = this.state.requestBody
        this.setState(() => { return { showSpinner: true, questionStack: this.state.questionStack.concat({ body }) } })
        axiosInstance.post("generateAnswer", this.state.requestBody)
            .then(res => {
                const data = res.data.answers[0];
                if (data.id === -1) {
                    this.props.onEditInspection({
                        responseStack: [],
                        questionStack: [],
                        metadata: "",

                    })
                    this.props.history.push("/feedback")
                }
                this.setState(() => { return { data: data, showSpinner: false } });
            }).catch(error => {
                console.log(error);
                this.setState(() => { return { showSpinner: false } })
            });
        const { questionStack } = this.state;
        this.props.onEditInspection({ questionStack })
    }


    handleRadio = (event) => {
        const id = event.target.id ? event.target.id : "";
        const type = event.target.type
        const selectOption = event.target.value;
        const { CREATEJOURNEY } = this.props.payload
        const { metadata } = CREATEJOURNEY ? CREATEJOURNEY : ''
        const meta = metadata && metadata !== "yes" ? (metadata + event.target.value.slice(0, 3).toLowerCase()) : event.target.value.slice(0, 3).toLowerCase();
        var reqbody = "";
        if (meta !== "yes") {
            reqbody = {
                "question": selectOption,
                "top": 1,
                "strictFilters": [{ "name": "context", "value": meta }]
            }
        } else {
            reqbody = {
                "question": selectOption,
            }
        }
        const resbody = {
            "question_id": this.state.data.id,
            "answer_id": id ? id : "",
            "answer_time": moment.utc().format('DD/MM/YY hh:mm:ss'),
            "descriptive_answer": type == "text" ? selectOption : ""
        }
        this.setState(() => { return { condition: id, metadata: meta, change: true, requestBody: reqbody, user_response: resbody, msg: false } });
    }

    // rawrequest = (prompts) => {
    //     var arr = prompts.map((x) => { return x.displayText })
    //     const reqbody = {
    //         "question": arr[0]
    //     }
    //     this.setState(() => { return { requestBody: reqbody } });
    // }

    saveInStorage = (user_response) => {
        const { LOGIN } = this.props.payload;
        const { user } = LOGIN ? LOGIN : ''
        const { user_id } = user ? user : JSON.parse(window.localStorage.getItem("csf_user"));
        user_response["user_id"] = user_id;
        user_response["topic_id"] = this.state.topicId;


        this.setState(() => { return { showSpinner: true, change: false } });
        this.fetch();

        // axiosLoginInstance.post("CFTUserJourneyTrigger/answer", user_response)
        //     .then(res => {
        //         const data = res.data;
        //         console.log(data);
        //         this.fetch();
        //     }).catch(error => {
        //         console.log(error);
        //         this.setState(() => { return { showSpinner: false } })

        //     });
    }

    handleSubmit = () => {
        const { CREATEJOURNEY, LOGIN } = this.props.payload
        const { responseStack, questionStack } = CREATEJOURNEY ? CREATEJOURNEY : "";
        const { user } = LOGIN ? LOGIN : "";
        console.log(this.state)
        var noRadio = false
        if (this.state.data.context && this.state.data.context.prompts.length == 1) {
            var arr = this.state.data.context.prompts.map((x) => { return x.displayText })
            const reqbody = {
                "question": arr[0]
            }
            this.props.onEditInspection({
                responseStack: [],
                questionStack: [],
                metadata: "",

            })
            this.setState(() => { return { requestBody: reqbody, responseStack: "" } });

            noRadio = true;
        }

        const { metadata, data, user_response } = this.state;
        this.setState(() => { return { responseStack: this.state.responseStack.concat(user_response) } })
        if (this.state.change) {
            const { responseStack } = this.state
            const index = responseStack.findIndex((x) =>  x.question_id === user_response.question_id );
            if (responseStack && index !== -1) {
                responseStack[index].answer_id = user_response.answer_id;
                responseStack[index].answer_time = user_response.answer_time;
                var responseStack_ = responseStack
            } else {
                var responseStack_ = responseStack.concat(user_response);
            }

            this.props.onEditInspection({ metadata, responseStack: responseStack_ })
        }
        if (noRadio) {
            this.props.onEditInspection({ metadata: '' })
        }
        if (metadata == "yes") {
            this.setState(() => { return { showSpinner: true } })
            axiosLoopbackInstance.post("loopback?user_id=UID070820T10535764")
                .then(res => {
                    const data = res.data;
                    console.log(data);
                    this.fetch();
                }).catch(error => {
                    console.log(error);
                    this.setState(() => { return { showSpinner: false } })

                });
        }
        if (this.state.topicId === -1) {
            const topicId = data.id;
            this.setState(() => { return { topicId } })
            this.props.onEditInspection({ topicId: topicId })
            this.fetch();
        }
        else if (user_response) {
            this.state.change || noRadio ? this.saveInStorage(user_response) : this.fetch()
        }
        else this.setState(() => { return { msg: true } });
    }

    downloadActionPlan = () => {
        return (
            <PDFDownloadLink document={<DownloadActionPlan />} fileName="sample.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink>
        )
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

        if (prompts.length > 1) {
            const radios = prompts.map((x, index) => {
                const checked = res && x.qnaId == res.answer_id ? "cheched" : ''
                return (
                    <CustomRadio radioLabel={x.displayText} id={x.qnaId} key={x.qnaId} checked={checked} onClick={this.handleRadio} />
                )
            })
            return (radios);
        }
    }

    handleBack = () => {
        const { CREATEJOURNEY } = this.props.payload
        const { metadata, responseStack, questionStack } = CREATEJOURNEY ? CREATEJOURNEY : "";
        const previousResponse = responseStack[responseStack.length - 1];
        const proviousquestion = questionStack[questionStack.length - 1];
        const newMeta = proviousquestion.body.strictFilters ? proviousquestion.body.strictFilters[0].value : ""
        const newQueStk = questionStack.pop()
        console.log(previousResponse, proviousquestion)
        this.props.onEditInspection({ metadata: newMeta, questionStack: newQueStk })
        this.setState(() => { return { requestBody: proviousquestion.body, questionStack: questionStack.slice(questionStack.length - 2) } }, () => { this.fetch() })

    }


    splitQuestionData = () => {
        const text = this.state.data.answer;
        const textarray = text.split("\n");
        const paragraphs = textarray.map((x, index) => {
            if (x.startsWith("#")) {
                const x_ = x.split(" ");
                const n = x_[0].length;
                const CustomTag = `h${n}`;
                return (
                    <CustomTag className={classes.heading} key={index}> {x.slice(n)} </CustomTag>
                )

            }
            else if (x.trim().startsWith("[")) {
                const link = x.slice(12).replace(/^\((.+)\)$/, '$1');
                return (
                    <a target="_blank" key={index} className={classes.linkElement} href={link}>Click Here</a>
                )
            }
            else if (x.trim().startsWith("_<insert text field>_")) {
                return (
                    <Form key={index}>
                        <Form.Group controlId={index}>
                            <Form.Control type="text" defaultValue={""} autoComplete="off" />
                        </Form.Group>
                    </Form>
                )
            }
            else if (x.trim().startsWith("*")) {
                return (
                    <p key={index} className={classes.para}>{x.trim().slice(4)}</p>
                )
            }
            else {
                return (
                    <p key={index} className={classes.para}>{x.trim()}</p>
                )
            }



        })

        return (paragraphs);
    }

    render() {
        const paragraphs = this.state.data ? this.splitQuestionData() : console.log()
        const question = this.state.data ? this.state.data.answer : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts, this.state.data.id) : console.log()
        const downloadActionPlan = this.downloadActionPlan();
        return (
            <div>
                <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>

                <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                    {paragraphs}
                    <Form>
                        {this.state.msg ? <h5 className={classes.error}>*Please select an option</h5> : null}
                        {radios ? radios : ""}

                    </Form>
                    <div style={{ width: "100%" }}>
                        <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton>
                        <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton>
                    </div>
                    {/* {downloadActionPlan} */}
                </div>

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
