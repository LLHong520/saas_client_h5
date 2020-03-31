import Vue from "vue";
import vueCookies from "vue-cookies";
import VueClipboard from "vue-clipboard2";
import VueVideoPlayer  from "vue-video-player";
import VueAwesomeSwiper from "vue-awesome-swiper/dist/ssr";
import VueLazyload from "vue-lazyload";
import VCalendar from "v-calendar";
import vueStorage from "./storage";
//设置cookie到期时间为七天
vueCookies.config("7d");
Vue.use(vueCookies);
Vue.use(VueClipboard);
Vue.use(VueVideoPlayer);
Vue.use(VueAwesomeSwiper);
Vue.use(VCalendar);
Vue.use(VueLazyload, {
  preLoad: 1.3, //预加载的宽高比
  // error: "dist/error.png", //图片加载失败时使用的图片源
  // loading: "dist/loading.gif", //图片加载的路径
  attempt: 1 //尝试加载次数
});

Vue.use(vueStorage, {
  // defaultType: "local", // default: local
  storagePre: "saas_h5_"
});

// 移动端调试
/*import { PROJECT_ENV } from "@/config";
import VConsole from "vconsole";
let vConsole = null;

if (PROJECT_ENV === "dev" || PROJECT_ENV === "development") {
  vConsole = new VConsole();
}

export default vConsole;*/
