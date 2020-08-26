import axios from 'axios';


export const baseURL = process.env.REACT_APP_BASEURL;
export const baseUIURL = process.env.REACT_APP_UI;
export const loginUIURL = process.env.REACT_APP_LOGIN_URL;

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000, //10 seconds before request timeout
  headers: {
    "Authorization": "EndpointKey 82918fc2-6ffc-47b7-bfdd-3c20b2aa2d3c"
  }
});


export const axiosLoginInstance = axios.create({
  baseURL: loginUIURL,
  timeout: 30000, //10 seconds before request timeout
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export const axiosLoopbackInstance = axios.create({
  baseURL: "https://cft-pythondbtest.azurewebsites.net/api/CFTLoopBackTrigger/",
  timeout: 30000, //10 seconds before request timeout
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export const axiosFeedbackInstance = axios.create({
  baseURL: "https://cft-pythondbtest.azurewebsites.net/api/CFTFeedbackTrigger/",
  timeout: 30000, //10 seconds before request timeout
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

axiosLoginInstance.defaults.headers.common['cache-control'] = `no-cache, no-store`;
axiosLoginInstance.defaults.headers.common['Pragma'] = `no-cache`;

axiosInstance.defaults.headers.common['cache-control'] = `no-cache, no-store`;
axiosInstance.defaults.headers.common['Pragma'] = `no-cache`;


