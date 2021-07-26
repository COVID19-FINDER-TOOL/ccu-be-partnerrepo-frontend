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
    if (Tag === "span"  && children && children[0]?.props.children.length === 1 && children[0]?.props.children[0]?.type!=="em" ){
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

    if(Tag === "li"){
      props = {
        className: "paraElement",
      }
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

  const generateMenus = (data,topic) =>{
    const Menu = data[0].map((x,index)=>{
      return (
        <div className="menu">
          <div name={"sub"+(index+1)} role="button" className={current=== "sub"+(index+1) ?"menuBar menuBarClicked":"menuBar"} onClick={()=>handleClick("sub"+(index+1))}>
            <p>
              {topic == 3 ? menu[index].slice(3) : menu[index].slice(3).slice(3, -2)}
            </p>
          </div>
          <div>{generateLinks(data[1][index], topic)}</div>
        </div>
      )
    })
    return Menu
  }

  const rights = assembleData(props.data);
  const menu = rights[0];
  const topic = props.topic;
  return (
    <>
    <h2 className="heading">
        {litrals.welcome.text5}
      </h2>

    {props.text && 
      <MDReactComponent
            text={props.text}
            onIterate={handleIterate}
          />
      }
      
      <div className="menuContainer">
        {generateMenus(rights,topic)}
      </div>
      <div className="belowText">
      </div>
    </>
  );
};

export default Menubar;
