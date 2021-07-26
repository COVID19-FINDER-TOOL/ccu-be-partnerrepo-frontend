import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import MDReactComponent from 'markdown-react-js'; 

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    orientation: 'portrait',
    
  },
  sumHeading: {
    textAlign: "center",
    fontSize: "1.5vh",
  },
  summary: {
    textAlign: "center",
    fontSize: "1vh"
  },
  heading: {
    textAlign: "center",
    fontSize: "3vh",
    fontWeight: "bold",
  },
  View: {
    padding: "5% 10% 0 10%",
    paddingBottom: 0
  },
  para: {
    marginTop: "2%",
    fontSize:"15"
  },
  pageBackground: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    display: 'block',
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  linkViewDiv: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    flexDirection: "row",
    width: "100%"
  },
  linkView: {
    display: "flex",
    flexWrap: "wrap",
    width: 210,
    minHeight: "5vh",
    borderColor: "Azure",
    backgroundColor: "#EDEDED",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: "1mm",
    opacity: "1",
    marginTop: 20,
    padding: 10,
    marginRight: 25,
    fontSize: 12,
    color: "#007bff",

  },
  links: {
    display: "block",
    margin: "auto",
  },
  iconImage: {
    width: "3m",
    display: "flex",
    flexDirection: "row",
    margin: "auto"
  }
});

const handleIterate = (Tag, props, children, level) => {

  if (Tag === 'p' || Tag === 'li' || Tag === 'ol' || Tag === 'span') {
    props = {
      ...props,
      // className: classes.para
    };
    return <Text {...props}>{children}</Text>;
  }

  if (Tag === 'a') {
    props = {
      ...props,
      target: "_blank",
      src: props.href
    };
    return <Link target="_blank" style={styles.links} {...props}>{children}</Link>;
  }

}

const DownloadActionPlan = (props) => {
  // const summ = props.summary

  const text = props.data;
  const textarray = text.split("\n");
  var texts = [];
  var links = [];
  textarray.map((x) => {
    if (x.match(/^\d/)) {
      links.push(x)

    } else {
      texts.push(x)
    }
  })
  return (
    <Document>
      <Page size="A4" object-fit="fill" style={styles.page}>
        <Image src={require("../../assets/Images/Magnifying glass buterflies.jpg")} style={styles.pageBackground} />
        <View style={styles.View}>
          {/* <Text style={styles.sumHeading}>Summary of your response to Support Finder’s questions</Text> */}
          {/* <View><Text style={styles.summary}>{Journey.join(" > ")}</Text></View> */}
          <View style={{ marginTop: "2%" }}>
            <Text style={styles.heading}>Your Action Plan</Text>
            {texts.map((x) => {
              return <Text style={styles.para}>{x}</Text>
            })}
          </View>
          <View style={styles.linkViewDiv}>
            {
              links.map((x, index) => {
                return (
                  <View style={styles.linkView}>
                    <MDReactComponent text={x} onIterate={handleIterate}></MDReactComponent>
                  </View>
                )
              })
            }
          </View>
        </View>

      </Page>
    </Document>
  )
}


export default DownloadActionPlan;