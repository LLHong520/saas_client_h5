import sysService from "~/services/sysService.js";

const dataCollectMixin = {
  methods: {
    _getOperate({ contentId, contentType }, store) {
      // 获取是否已点赞
      return new Promise( (resolve, reject) => {
        sysService.isOperate({
          contentId: contentId,
          userId: this._getUserAttr("id", store), // 注： 有需要在asyncData用时，需要把store传进来
          operationType: "2",// 0：浏览；1：评论；2：点赞
          contentType: contentType,// 0：视频；1：社区、2：文章 、3：专题、4：帖子、5:咨询室 、6:调查问卷、7:社区介绍 、8:按钮广告 、9:广告栏、10:健康知识、 11:健康公告、12:医院推荐
        }).then( res => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(false);
          }
        }).catch( () => {
          reject(false);
        });
      });
    },
    _dataCollect({ contentId, contentType, operationType, authorId, contentCreateTime, title, label, duration}, callback) {
      // 打点数据
      return new Promise( (resolve, reject) => {
        sysService.receive({
          contentId: contentId,// 内容id
          contentType: contentType,// 0：视频；1：社区、2：文章 、3：专题、4：帖子、5:咨询室 、6:调查问卷、7:社区介绍 、8:按钮广告 、9:广告栏、10:健康知识、 11:健康公告、12:医院推荐、13:预约计划
          operationType: operationType,// 0：浏览；1：评论；2：点赞；3：分享；4:提交；5：提交成功 6：数据渲染完；7：加载时长； 8：访问时长 ；
          authorId: authorId,// 作者Id
          contentCreateTime: contentCreateTime,// 内容创建时间
          title: title,// 标题
          label: label,// 标签
          channel: this.$route.query ? (this.$route.query.channel || "") : "",// 渠道
          equipmentNumber: "",// 设备号
          equipmentType: this._getEquipmentType(),// 设备类型（安卓:android 苹果:ios）
          ip: this._getIP(),// ip地址
          source: this._getSource(),// 0：pc；1：h5；2：小程序；3：微博 4：微信 5：爱问医生APP
          userId: this._getUserAttr("id"),
          sex: this._getUserAttr("gender"),// 0：女；1：男
          thirdType: this._getThird("type"),// 微博:wiebo 微信:weixin
          thirdUserId: this._getThird("id"),// 第三方用户id
          city: this._getAddress(),// 获取地理位置
          duration:duration,//加载时间
        }).then( res => {
          resolve(res);
        }).catch( () => {
          reject(false);
        }).finally( () => {
          if (callback) {
            callback();
          }
        });
      });
    },
    _getThird(type) {
      let { userInfo } = this.$store.state;
      let isLogin = this.$store.getters.isLogin;
      let accountBinding = {};
      let result = {
        type: "",
        id: ""
      };

      // 判断登录是否有第三方信息
      if (isLogin) {
        accountBinding = userInfo.accountBinding || {};
      }

      // 获取第三方平台、id
      if(this.$platformInfo.os.isWeibo) {
        result.type = "weibo";
        result.id = accountBinding.weiboUid || "";
      }
      if (this.$platformInfo.os.isWx || this.$platformInfo.os.isMp) {
        result.type = "weixin";
        result.id = accountBinding.wexinUnionId || "";
      }

      return result[type];
    },
    _getUserAttr(attr, store) {
      // 注： 有需要在asyncData用时，需要把store传进来
      let { userInfo } = store ? store.state : this.$store.state;
      let isLogin =  store ? store.getters.isLogin : this.$store.getters.isLogin;

      if (isLogin) {
        return userInfo[attr] || "";
      } else {
        return "";
      }
    },
    _getIP() {
      // ip地址
      let ip = "";

      if (returnCitySN) {
        ip = returnCitySN.cip;
      }

      return ip;
    },
    _getSource() {
      // 0：pc；1：h5；2：小程序；3：微博 4：微信 5：爱问医生APP
      let result = "0";

      if(this.$platformInfo.os.deviceInfo.width > 760) {
        result = "1";
      }
      if(this.$platformInfo.os.isMp) {
        result = "2";
      }
      if(this.$platformInfo.os.isWeibo) {
        result = "3";
      }
      if(this.$platformInfo.os.isWx) {
        result = "4";
      }
      if(this.$platformInfo.iaskApp) {
        result = "5";
      }

      return result;
    },
    _getEquipmentType() {
      let result = "";

      if(this.$platformInfo.os.isAndroid) {
        result = "android";
      }
      if (this.$platformInfo.os.isiOS) {
        result = "ios";
      }

      return result;
    },
    async _getAddress() {
      await this.$store.dispatch("getCurrentCity");
      return this.$store.state.city;
    }
  }
};

export default dataCollectMixin;
