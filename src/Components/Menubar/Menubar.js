import React, { useState } from "react";

import "./Menubar.scss";

import MDReactComponent from "markdown-react-js";
import litrals from "../Litrals/Litrals";

const Menubar = (props) => {
  const [current, setCurrent] = useState("mail");

  const handleClick = (e) => {
    setCurrent(()=>e);
    console.log(current);

  };

  const assembleData = (data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    return [keys, values];
  };

  const handleIterate = (Tag, props, children, level) => {
    if (Tag === "span"  && children[0].props.children.length === 1 && children[0].props.children[0].type!=="em" ){
      // console.log(children[0].props.children[0].type)
      props = {
        ...props,
        className: "linkSpan",
      };
    }
    if (Tag === "p") {
      props = {
        ...props,
        className: "paraElement",
      };
    }

    if (Tag === "a") {
      props = {
        ...props,
        target: "_blank",
        href: props.href,
        className: "linkElement",
      };
    }
    return <Tag {...props}>{children}</Tag>;
  };

  const generateLinks = (data, topic) => {
    const links = data.map((x, index) => {
      const x1 = x.split(":");
      const x2 = x1.slice(1).join(":");
      
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      return (
        <div className="optionDiv">
          <MDReactComponent
            key={index}
            text={topic == 3 ? x : x2}
            onIterate={handleIterate}
          />
          <i className={"fas fa-external-link-alt icon"}></i>
        </div>
      );
    });
    return links;
  };

  const generateMenus = () =>{
    const Menu = null
  }

  const rights = assembleData(props.data);
  const menu = rights[0];
  const topic = props.topic;
  console.log(rights)
  return (
    <>
      <h2 className="heading">
        {topic == 3 ? litrals.welcome.text5 : litrals.welcome.text6}
      </h2>
      <div className="menuContainer">
        <div className="menu">
          <div name="sub1" role="button" className={current==="sub1"?"menuBar menuBarClicked":"menuBar"} onClick={()=>handleClick("sub1")}>
            <p>
              {topic == 3 ? menu[0].slice(3) : menu[0].slice(3).slice(3, -2)}
            </p>
          </div>
          <div style={{display : current==="sub1" ? 'block' : 'none'}}>{generateLinks(rights[1][0], topic)}</div>
        </div>
        <div className="menu">
          <div name="sub2" role="button" className={current==="sub2"?"menuBar menuBarClicked":"menuBar"} onClick={()=>handleClick("sub2")}>
            <p>
              {topic == 3 ? menu[1].slice(3) : menu[1].slice(3).slice(3, -2)}
            </p>
          </div>
          <div style={{display : current==="sub2" ? 'block' : 'none'}}>{generateLinks(rights[1][1], topic)}</div>
        </div>
        <div className="menu">
          <div name="sub3" role="button" className={current==="sub3"?"menuBar menuBarClicked":"menuBar"} onClick={()=>handleClick("sub3")}>
            <p>
              {topic == 3 ? menu[2].slice(3) : menu[2].slice(3).slice(3, -2)}
            </p>
          </div>
          <div style={{display : current==="sub3" ? 'block' : 'none'}}>{generateLinks(rights[1][2], topic)}</div>
        </div>
        <div className="menu">
          <div name="sub4" role="button" className={current==="sub4"?"menuBar menuBarClicked":"menuBar"} onClick={()=>handleClick("sub4")}>
            <p>
              {topic == 3 ? menu[3]?.slice(3) : menu[3]?.slice(3).slice(3, -2)}
            </p>
          </div>
          <div style={{display : current==="sub4" ? 'block' : 'none'}}>{generateLinks(rights[1][3], topic)}</div>
        </div>
      </div>
    </>
  );
};

export default Menubar;
