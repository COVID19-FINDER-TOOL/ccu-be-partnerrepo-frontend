import axios from 'axios';


export const baseURL = process.env.REACT_APP_BASEURL;
export const baseUIURL = process.env.REACT_APP_UI;
export const loginUIURL = process.env.REACT_APP_LOGIN_URL;

export const axiosInstance = axios.create({
  baseURL: baseURL,  //should be window.$keyVault.baseURL
  timeout: 30000, 
  headers: {
    "Authorization": "EndpointKey bacab171-bbce-495d-ab75-43fd2a634240"
  }
});


export const axiosLoginInstance = axios.create({
  baseURL: loginUIURL, //should be window.$keyVault.loginURL
  timeout: 30000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});




axiosLoginInstance.defaults.headers.common['cache-control'] = `no-cache, no-store`;
axiosLoginInstance.defaults.headers.common['Pragma'] = `no-cache`;

axiosInstance.defaults.headers.common['cache-control'] = `no-cache, no-store`;
axiosInstance.defaults.headers.common['Pragma'] = `no-cache`;


