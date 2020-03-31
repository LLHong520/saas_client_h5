import mock from "./mock";//前端开发
import dev from "./dev"; //对接api
import development from "./development"; //开发环境
import test from "./test";//测试配置
import precond from "./precond";//预发配置
import production from "./production";//生产配置

// const env = "mock";
const env = "dev";
// const env = "development";
// const env = "test";
//const env = "precond";
const env = "production";
const envConfigs = {
  mock,
  dev,
  development,
  test,
  precond,
  production
};
export const API_URL = envConfigs[env].API_URL;
export const APP_URL = envConfigs[env].APP_URL;
export const PIC_URL = envConfigs[env].PIC_URL;
export const SUB_FIX = envConfigs[env].SUB_FIX;
export const LOGIN_URL = envConfigs[env].LOGIN_URL;
export const LOGO_URL = envConfigs[env].LOGO_URL;
export const PROJECT_ENV = env;
