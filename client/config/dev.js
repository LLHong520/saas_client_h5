/*对接api联调配置*/
const APP_URL = "http://127.0.0.1:8082/c";
const configs = {
  API_URL: APP_URL,
  APP_URL: APP_URL,
  PIC_URL: "https://wenwo-img-bucket-test.oss-cn-beijing.aliyuncs.com/", //图片路径修复
  SUB_FIX: "", //图片后缀
  LOGIN_URL: "http://192.168.1.240:51003"
};
export default configs;
