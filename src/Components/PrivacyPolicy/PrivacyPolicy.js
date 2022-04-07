import React from 'react'
import Header from "../Header/Header";
import Footers from "../../Components/Footers/Footers";
import classes from "./PrivacyPolicy.module.scss";
import { Form, Row, Col, Container } from 'react-bootstrap';
import litrals from "../Litrals/Litrals";
const PrivacyPolicy = () => {
    return (
      <div className={classes.backgrondImage}>
        <Header heading="8" ></Header>

        {/* <div>
          <div className={classes.wlcmRow}>
            <Row>
              <Col xs={12} md={12} className={classes.colTabs}>
                <div>
                  <h3 className={classes.tabsHeading}>
                    Breathe Easy Privacy Notice{" "}
                  </h3>
                  <h5 className={classes.tabsSubHeading}>
                    Who is in charge of the data collected for Breathe Easy?{" "}
                  </h5>
                  <p className={classes.tabsPara}>
                    Capital Credit Union (CCU) are in charge of the data
                    collected for Breathe Easy. This means they are known as the
                    Data Controller. They have tasked Sopra Steria to collect
                    and analyse the data on their behalf. This means Sopra
                    Steria is known as the Data Processor. CCU can be contacted
                    at the
                    <br />
                    following address:
                    <br />
                    Capital Credit Union Ltd
                    <br />
                    31 Dunedin Street
                    <br />
                    Edinburgh
                    <br />
                    EH7 4JG
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    Who is in charge of the data collected for Breathe Easy at
                    Sopra Steria?
                  </h5>
                  <p className={classes.tabsPara}>
                    The data collected and analysed by Sopra Steria cannot be
                    traced back to any person. The person responsible for this
                    data at Sopra Steria can be contacted at the following
                    address or phone number:
                    <br />
                    Data Protection Officer
                    <br />
                    Three Cherry Trees Lane
                    <br />
                    Hemel Hempstead
                    <br />
                    HP2 7AH
                    <br />
                    Herts
                    <br />
                    Tel + 44 (0) 370 600 4466
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    Why are the data being collected and used?
                  </h5>
                  <p className={classes.tabsPara} clas>
                    The data are used to filter questions in the questionnaire.
                    This means that we only ask you questions which are relevant
                    to your situation. It also means that we can produce an
                    action plan based on your answers to the questions.
                    <br />
                    <pre></pre>
                    The datawhich are collected are processed to understand
                    trends in financial vulnerability of CCU’s customers. Most
                    of the data are anonymised, so no-one can be identified from
                    them. The data are then analysed by Sopra Steria. This helps
                    us to know whether people of a particular age or ethnic
                    group (for example) are experiencing more problems
                    financially than other people.
                    <br />
                    <pre></pre>
                    At the end of the process, you will be asked for your email
                    address. This is so that we can send the results of the
                    questionnaire to you. We do not store your email address and
                    delete it once the email has been sent to you. You do not
                    have to give your email address. If you don’t give us your
                    email address, though, we cannot send you the results of the
                    questionnaire.
                    <br />
                    <pre></pre>
                    All data is collected with your consent.
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    Who will see my email address?{" "}
                  </h5>
                  <p className={classes.tabsPara}>
                    The only person to see your email address will be the CCU
                    agent who enters it into the Breathe Easy tool. After this,
                    the email address is automatically attached to your action
                    plan. This is then emailed to you. Once the email has been
                    sent, your email address is removed from our system.{" "}
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    How long will my email address be kept for?{" "}
                  </h5>
                  <p className={classes.tabsPara}>
                    Your email address will not be kept any longer than is
                    needed to send you the email with your action plan. Once
                    this has been sent, your email address is removed from our
                    system.
                    <br />
                    <pre></pre>
                    The length of the Notice will vary but the 12 points should
                    be covered in plain English to assure it is understood by
                    the intended audience. See suggested headings below.
                    <br />
                    <pre></pre>
                    What if I am unhappy with how my email address is being
                    used?
                    <br />
                    <pre></pre>
                    You do not need to give your email address. If you change
                    your mind, you can also ask the CCU agent not to use your
                    email address. This will mean that we cannot send you your
                    action plan, though. If you are still unhappy about how your
                    email address is being used, you can contact the regulator
                    (the Information Commissioner’s Office) at the following
                    address:
                    <br />
                    <pre></pre>
                    <a href=" https://ico.org.uk/make-a-complaint/data-protection-complaints/">
                      {" "}
                      https://ico.org.uk/make-a-complaint/data-protection-complaints/
                    </a>
                    <br />
                    <pre></pre>
                    or write to the regulator at:
                    <br />
                    Information Commissioner's Office
                    <br />
                    Wycliffe House
                    <br />
                    Water Lane
                    <br />
                    Wilmslow
                    <br />
                    Cheshire
                    <br />
                    SK9 5AF
                    <br />
                    <pre></pre>
                    Telephone: 0303 123 1113
                    <br />
                    Fax: 01625 524510 .{" "}
                  </p>
                </div>
                <div></div>
              </Col>
            </Row>
          </div>
        </div> */}

        <div style={{ display: "block"}}>
          <div className={classes.wlcmRow}>
            <Row>
              <Col xs={12} md={12} className={classes.colTabs}>
              <div>
                  <h3 className={classes.tabsHeading}>
                    Breathe Easy Privacy Notice{" "}
                  </h3>
                  <h5 className={classes.tabsSubHeading}>
                    Who is in charge of the data collected for Breathe Easy?{" "}
                  </h5>
                  <p className={classes.tabsPara}>
                    Capital Credit Union (CCU) are in charge of the data
                    collected for Breathe Easy. This means they are known as the
                    Data Controller. They have tasked Sopra Steria to collect
                    and analyse the data on their behalf. This means Sopra
                    Steria is known as the Data Processor. CCU can be contacted at the following address:
                    <br />
                    <br />
                    Capital Credit Union Ltd
                    <br />
                    31 Dunedin Street
                    <br />
                    Edinburgh
                    <br />
                    EH7 4JG
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    Who is in charge of the data collected for Breathe Easy at
                    Sopra Steria?
                  </h5>
                  <p className={classes.tabsPara}>
                    The data collected and analysed by Sopra Steria cannot be
                    traced back to any person. The person responsible for this
                    data at Sopra Steria can be contacted at the following
                    address or phone number:
                    <br />
                    <br />
                    Data Protection Officer
                    <br />
                    Three Cherry Trees Lane
                    <br />
                    Hemel Hempstead
                    <br />
                    HP2 7AH
                    <br />
                    Herts
                    <br />
                    Tel + 44 (0) 370 600 4466
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    Why are the data being collected and used?
                  </h5>
                  <p className={classes.tabsPara} clas>
                    The data are used to filter questions in the questionnaire.
                    This means that we only ask you questions which are relevant
                    to your situation. It also means that we can produce an
                    action plan based on your answers to the questions.
                    <br />
                    <pre></pre>
                    The data  which are collected are processed to understand
                    trends in financial vulnerability of CCU’s customers. Most
                    of the data are anonymised, so no-one can be identified from
                    them. The data are then analysed by Sopra Steria. This helps
                    us to know whether people of a particular age or ethnic
                    group (for example) are experiencing more problems
                    financially than other people.
                    <br />
                    <pre></pre>
                    At the end of the process, you will be asked for your email
                    address. This is so that we can send the results of the
                    questionnaire to you. We do not store your email address and
                    delete it once the email has been sent to you. You do not
                    have to give your email address. If you don’t give us your
                    email address, though, we cannot send you the results of the
                    questionnaire.
                    <br />
                    <pre></pre>
                    All data is collected with your consent.
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    Who will see my email address?{" "}
                  </h5>
                  <p className={classes.tabsPara}>
                    The only person to see your email address will be the CCU
                    agent who enters it into the Breathe Easy tool. After this,
                    the email address is automatically attached to your action
                    plan. This is then emailed to you. Once the email has been
                    sent, your email address is removed from our system.{" "}
                  </p>
                  <h5 className={classes.tabsSubHeading}>
                    How long will my email address be kept for?{" "}
                  </h5>
                  <p className={classes.tabsPara}>
                    Your email address will not be kept any longer than is
                    needed to send you the email with your action plan. Once
                    this has been sent, your email address is removed from our
                    system.
                    <br />
                    <pre></pre>
                    The length of the Notice will vary but the 12 points should
                    be covered in plain English to assure it is understood by
                    the intended audience. See suggested headings below.
                    <br />
                    </p>
                  <h5 className={classes.tabsSubHeading}>
                    What if I am unhappy with how my email address is being
                    used?</h5>
                    <p className={classes.tabsPara}>
                    You do not need to give your email address. If you change
                    your mind, you can also ask the CCU agent not to use your
                    email address. This will mean that we cannot send you your
                    action plan, though. If you are still unhappy about how your
                    email address is being used, you can contact the regulator
                    (the Information Commissioner’s Office) at the following
                    address:
                    <br />
                    <a href=" https://ico.org.uk/make-a-complaint/data-protection-complaints/" target='_blank'>
                      https://ico.org.uk/make-a-complaint/data-protection-complaints/
                    </a>
                    <br />
                    or write to the regulator at:
                    <br />
                    <br/>
                    Information Commissioner's Office
                    <br />
                    Wycliffe House
                    <br />
                    Water Lane
                    <br />
                    Wilmslow
                    <br />
                    Cheshire
                    <br />
                    SK9 5AF
                    <br />
                    Telephone: 0303 123 1113
                    <br />
                    Fax: 01625 524510 .{" "}
                  </p>
                </div>
                <div>
                </div>
              </Col>
            </Row>
          </div>

        </div>
        <Footers format={true} ></Footers>
      </div>
    );
}

export default PrivacyPolicy
