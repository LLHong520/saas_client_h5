import appsConfig from "~/consts/apps.js";
import homeService from "~/services/homeService.js";

const permission = {
  map: [],
  _store: {},
  async init(type, obj) {
    this._store = obj.store;
    await this.getPermission(obj);
    return this.getPagePermission(type, obj);
  },
  async getPermission({ store }) {
    // 获取所有应用配置数据
    let res = await homeService.getRecommendPosSet({});

    if (res.status == 200 && res.data) {
      this.map = this._getMap(res.data);
      store.commit("SET_PERMISSION_MAP", this.map);
      store.commit("SET_PERMISSION_LIST", this._getMap(res.data, "arr"));
    }
  },
  getPagePermission(type, { route, redirect, store }) {
    // 获取当前应用配置, type为空则返回所有配置：obj
    this._store = store;
    let isPass = type == "" ? true : this.checkPermission(type);
    let target = store.state.permission_map[type];

    if (!isPass) {
      return redirect("/notFound",{
        statusCode:404,
        message:"链接访问失效",
        showHeader:false
      });
    }

    return type
      ? (target || {})
      : store.state.permission_map;
  },
  _getMap(arr, type = "map") {
    // 处理本地数据与后台配置数据：obj
    let map = {};
    let list = [];
    let localConfig = JSON.parse(JSON.stringify(appsConfig));

    list = localConfig.map( a => {
      let target = arr.filter( b => { return a.posType == b.posType; });

      if (target.length > 0) {
        let alias = target[0].alias;
        let name = target[0].name;

        a = Object.assign(a, target[0]);
        a.icon = a.iconUrl;
        a.label = alias && alias != "--" ? alias : name;
        a.pagePermission = this.checkPermission(a.posType, a);
      }

      map[a.posType] = a;
      return a;
    });

    return type == "arr" ? list : map;
  },
  checkPermission(type, obj) {
    // 获取当前应用权限：
    let store = this._store;
    let result = false;
    let target = obj || store.state.permission_map[type] || {};
    let is_login = store.getters.isLogin && store.state.userInfo && store.state.userInfo.id;

    // 是否开放应用: 0关闭， 1开启
    result = target.openStatus && target.openStatus == 1;

    // 是否对全部用户开放应用: showStatus: 0医生， 1全部
    if (result && target.showStatus && target.showStatus == 0) {
      if (is_login) {
        let userType = store.state.userInfo.userType;
        result = userType != "NORMAL_P" || userType != "NORMAL_M"; // 非普通用户、马甲用户
      } else {
        result = false;
      }
    }

    // 针对健康科普 & 专题的
    if (target.hasOwnProperty("showForH5") && target.showForH5 === false) {
      result = false;
    }

    return result;
  }
};

export default permission;
