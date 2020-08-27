import React from 'react'
import classes from './Chatbot.module.css';
import { Form } from 'react-bootstrap';
import CustomRadio from '../CustomRadio/CustomRadio';
import DownloadActionPlan from '../DownloadActionPlan/DownloadActionPlan';
import CustomButton from '../CustomButton/CustomButton';
import litrals from '../Litrals/Litrals';
import { axiosInstance, axiosLoopbackInstance, axiosLoginInstance } from '../../AxiosHandler';
import { surveyData } from "../../store/Action/SurveyAction";
import { connect } from "react-redux";
import { onEditInspection } from "../../store/Action/LoginAction";
import moment from "moment";
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import NavTabs from '../NavTabs/NavTabs';
import MDReactComponent from 'markdown-react-js';


class Chatbot extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: "",
            requestBody: { "question": "Start the flow" },
            msg: false,
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


    }

    saveQuestion = (data,response) =>{
        var dataBody={}
        var kb = data.metadata.find((x)=> x.name === "idprefix") ? data.metadata.find((x)=> x.name === "idprefix").value : "kb0";
        dataBody.question_id = kb.concat("q").concat(data.id.toString());
        dataBody.question = data.answer;
        dataBody.answers = data.context.prompts.map((x)=>{
            return {aid:kb.concat("a").concat(x.qnaId.toString()),answer:x.displayText.toString()}
        })
        response.question_id = kb.concat("q").concat(response.question_id.toString())
        response.answer_id = kb.concat("a").concat(response.answer_id.toString())

        console.log(response)
        if(data.metadata.find((x)=>x.name==="topic" && x.value!="1")){
            this.fetch();
        }
        else{
        this.saveInStorage(response)
        axiosLoginInstance.post("CFTQnAInsertTrigger/add", dataBody)
            .then(res => {
                const data = res.data;
                console.log(data);
                this.fetch();
            }).catch(error => {
                console.log(error);
            });
        }
    }

    fetch = () => {
        const body = this.state.requestBody
        this.setState(() => { return { showSpinner: true, questionStack: this.state.questionStack.concat({ body }) } })
        axiosInstance.post(this.state.queryString[this.state.queryIndex], this.state.requestBody)
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
        const { questionStack,data } = this.state;

        this.props.onEditInspection({ questionStack })
    }


    handleRadio = (event) => {
        const value = event.target.value
        const queryIndex = event.target.name
        const id = event.target.id
        const type = event.target.type
        console.log(value,id)

        const resbody = {
            "question_id": this.state.data.id,
            "answer_id": id ? id : "",
            "answer_time": moment.utc().format('YYYY-MM-DD hh:mm:ss'),
            "descriptive_answer": ""
        }
        const { CREATEJOURNEY } = this.props.payload;
        var { responseStack } = CREATEJOURNEY ? CREATEJOURNEY : [];
        responseStack = responseStack.concat(resbody)
        // console.log(responseStack,resbody)

        // this.props.onEditInspection({ responseStack : responseStack})


        if (this.state.queryIndex === 0) {
            var nextques = "" //? this.setState(()=>{return{queryIndex}}): console.log();
            console.log(queryIndex)
            if(queryIndex==1){
                nextques = "Work flow started"
            }
            else{
                nextques = "Money Flow Started"
            }
            // switch (queryIndex) {
            //     case 1: { nextques = "Work flow started"; break; }
            //     case 2: { nextques = "Money Flow Started"; break; }
            //     case 3: { nextques = "Mental Health Flow Started"; break; }
            //     case 4: { nextques = "Work flow started"; break; }
            //     default: { nextques = "Work flow started"; break; }
            // }
            const requestBody = { "question": nextques };
            console.log(requestBody)

            this.setState(() => { return { queryIndex: queryIndex, requestBody } }, () => { this.saveQuestion(this.state.data, resbody) });

        }
        else {
            const { metadata } = this.state.data
            let meta = metadata[0].value
            meta = meta + value.slice(0, 3).toLowerCase()
            this.props.onEditInspection({ metadata: meta })
            const requestBody = {
                "question": value,
                "top": 1,
                "strictFilters": [{ "name": "context", "value": meta }]
            };
            this.setState(() => { return { requestBody } }, () => { this.saveQuestion(this.state.data, resbody) });
        }

        // this.saveQuestion(this.state.data)


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

        const radios = prompts.map((x, index) => {
            const checked = res && x.qnaId == res.answer_id ? "cheched" : ''
            return (
                <CustomRadio radioLabel={x.displayText} margin={(x.displayText=="Next" || x.displayText=="Action Plan")?true:""} width={x.displayText=="Next"?"7rem" : x.displayText=="Action Plan"?"10rem":""} id={x.qnaId} key={x.qnaId} name={index + 1} checked={checked} onClick={this.handleRadio} />
            )
        })
        return (radios);

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

    handleIterate = (Tag, props, children, level) => {
        // console.log(Tag)
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
        
        if (Tag === 'a') {
          props = {
            ...props,
            className: classes.linkElement,
            target : "_blank",
            href : props.href
          };
        }
        
        return <Tag {...props}>{children}</Tag>;
      }

    splitQuestionData = () => {
        const text = this.state.data.answer;
        const textarray = text.split("\n");
        const paragraphs = textarray.map((x, index) => {
            return <MDReactComponent text={x} onIterate={this.handleIterate} /> 
            // if (x.startsWith("#")) {
            //     const x_ = x.split(" ");
            //     const n = x_[0].length;
            //     const CustomTag = `h${n}`;
            //     return (
            //         <CustomTag className={classes.heading} key={index}> {x.slice(n)} </CustomTag>
            //     )

            // }
            // else if (x.trim().startsWith("[")) {
            //     const link = x.slice(12).replace(/^\((.+)\)$/, '$1');
            //     return (
            //         <a target="_blank" key={index} className={classes.linkElement} href={link}>Click Here</a>
            //     )
            // }
            // else if (x.trim().startsWith("_<insert text field>_")) {
            //     return (
            //         <Form key={index}>
            //             <Form.Group controlId={index}>
            //                 <Form.Control type="text" defaultValue={""} autoComplete="off" />
            //             </Form.Group>
            //         </Form>
            //     )
            // }
            // else if (x.trim().startsWith("*")) {
            //     return (
            //         <p key={index} className={classes.para}>{x.trim().slice(4)}</p>
            //     )
            // }
            
            // else {
            //     return (
            //         <p key={index} className={classes.para}>{x.trim()}</p>
            //     )
            // }



        })

        return (paragraphs);
    }

    displayNextTopic = (topic) =>{
        console.log(topic)
        if(topic == 3){
            const text = this.state.data.answer;
            const textarray = text.split("\n");
            var temp = {}
            var count = 0
            var key = ""
            textarray.map((x)=>{
                if(/^\d/.test(x.trim())){
                    key = x
                }
                else{
                    console.log(temp)
                    temp[key] ? temp[key].push(x.trim()) : temp[key] = [x.trim()]
                }
            })
            return <NavTabs data={temp}></NavTabs>
        }
    }

    render() {
        const topic = this.state.data.metadata ? this.state.data.metadata[1] ? this.state.data.metadata[1].value : 0 : 0;
        const paragraphs = this.state.data ? topic == 3 ? this.displayNextTopic(topic):this.splitQuestionData(): console.log()
        const question = this.state.data ? this.state.data.answer : console.log()
        const radios = this.state.data.context ? this.createForm(this.state.data.context.prompts, this.state.data.id) : console.log()
        const downloadActionPlan = this.downloadActionPlan();
        return (
            <div>
                <div style={{ display: this.state.showSpinner ? "block" : "none" }}><img alt="Loading...!!! " className={classes.spinner} src={require("../../assets/Images/Spinner-1s-200px.gif")}></img></div>

                <div style={{ display: this.state.showSpinner ? "none" : "block" }}>
                    {paragraphs}
                    <Form>
                        {radios ? radios : ""}

                    </Form>
                    <div style={{ width: "100%" }}>
                        {/* <CustomButton type="submit" onClick={this.handleBack} data={litrals.buttons.backNav}></CustomButton>
                        <CustomButton type="submit" float={"right"} onClick={this.handleSubmit} data={litrals.buttons.nextStep}></CustomButton> */}
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
