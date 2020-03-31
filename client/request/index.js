import axios from "axios";
import {API_URL} from "@/config";
axios.defaults.baseURL = API_URL;
// axios.defaults.timeout = 90000;
// import Vue from "vue";
var https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
});
var qs = require("qs");

export default {
  get: function (url, data = {}) {
    return axios.get(url, {
      params: data,
      httpsAgent: agent
    })
      .then((res) => {
        return Promise.resolve(res.data);
      });
  },
  put: function (url, data = {}) {
    return axios.put(url + "?" + qs.stringify(data), {
      httpsAgent: agent
    })
      .then((res) => {
        return Promise.resolve(res.data);
      });
  },
  delete: function (url, data = {}) {
    return axios.delete(url + "?" + qs.stringify(data),{
      httpsAgent: agent
    })
      .then((res) => {
        return Promise.resolve(res.data);
      });
  },
  post: function (url, data = {}) {
    return axios.post(url, data, {
      httpsAgent: agent
    })
      .then((res) => {
        return Promise.resolve(res.data);
      });
  },
  postFile: function (url, data) {
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      httpsAgent: agent
    };
    return axios.post(url, data, config)
      .then((res) => {
        return Promise.resolve(res.data);
      });
  },
  postUrl: function (url, data) {
    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      httpsAgent: agent
    };
    return axios.post(url, data, config)
      .then((res) => {
        return Promise.resolve(res.data);
      });
  },
  apiCreator(http, arr) {
    let obj = {};
    arr.forEach( item => {
      obj[item.name] = function(data, redirectUrl) {
        return http[item.type](redirectUrl || item.url, data);
      };
    });
    return obj;
  }
};
