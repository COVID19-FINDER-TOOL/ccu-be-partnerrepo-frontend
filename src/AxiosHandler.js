import axios from 'axios';


export const baseURL=process.env.REACT_APP_BASEURL;
export const baseUIURL=process.env.REACT_APP_UI;
export const axiosInstance =  axios.create({
    baseURL: baseURL,
    timeout: 30000, //10 seconds before request timeout
    headers:{
      "Authorization":"EndpointKey e1b47781-38b7-43d4-843d-8d0fa5c1af65"
    }
  });
  axiosInstance.defaults.headers.common['cache-control']=`no-cache, no-store`;
  axiosInstance.defaults.headers.common['Pragma']=`no-cache`; 
  


