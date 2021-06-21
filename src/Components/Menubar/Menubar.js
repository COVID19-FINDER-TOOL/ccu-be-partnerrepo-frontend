import React, { useState } from "react";
import "antd/dist/antd.css";
import "./Menubar.scss";
import { Menu } from "antd";
import MDReactComponent from "markdown-react-js";
import litrals from "../Litrals/Litrals";

const { SubMenu } = Menu;

const Menubar = (props) => {
  const [current, setCurrent] = useState("mail");

  const handleClick = (e) => {
    setCurrent({ current: e.key });
  };

  const assembleData = (data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    return [keys, values];
  };

  const handleIterate = (Tag, props, children, level) => {
    if (Tag === "p") {
      props = {
        ...props,
        className: "linkElement",
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
      console.log(x1,x2)
      // const icon = sendIcon(index)
      // const style = {
      //     display:"block", margin: "auto", borderRadius: "5%"
      // }
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      return (
        <Menu.Item key={index}>
          {topic == 3 ? (
            <div className="optionDiv">
              <MDReactComponent
                key={index}
                text={x}
                onIterate={handleIterate}
              />
              <i className="fas fa-external-link-alt icon"></i>
            </div>
          ) : (
            <div className="optionDiv" >
              <MDReactComponent
                key={index}
                text={x2}
                onIterate={handleIterate}
              />
              <i className="fas fa-external-link-alt icon"></i>
            </div>
          )}
        </Menu.Item>
      );
    });
    return links;
  };

  const rights = assembleData(props.data);
  const menu = rights[0];
  const topic = props.topic;
  console.log(rights);

  return (
    <>
      <h2 className="heading">
        {topic == 3 ? litrals.welcome.text5 : litrals.welcome.text6}
      </h2>
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        triggerSubMenuAction={"click"}
      
      >
        <SubMenu key="sub1" title={ topic == 3 ? menu[0].slice(3) : menu[0].slice(3).slice(3,-2)}>
          {generateLinks(rights[1][0], topic)}
        </SubMenu>
        <SubMenu key="sub2" title={ topic == 3 ? menu[1].slice(3) : menu[1].slice(3).slice(3,-2)}>
          {generateLinks(rights[1][1], topic)}
        </SubMenu>
        <SubMenu key="sub4" title={ topic == 3 ? menu[2].slice(3) : menu[2].slice(3).slice(3,-2) }>
          {generateLinks(rights[1][2], topic)}
        </SubMenu>
      </Menu>
    </>
  );
};

export default Menubar;
