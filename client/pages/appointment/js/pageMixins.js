import communityService from "~/services/communityService.js";
import articleService from "~/services/articleService.js";
import { mapState } from "vuex";
import { dataCollectMixin } from "~/mixins";

import defaultImg from "@/assets/images/default/img_doc_emp@2x.png";
import dialogEdit from "../components/dialog_edit.vue";
import dialogNone from "../components/dialog_none.vue";
import dialogFilter from "../components/dialog_filter";
import dialogArea from "../components/dialog_area";
import rate from "../components/rate";
import pageLoading from "~/components/pageLoading.vue";

import default_img_doc from "@/assets/images/default/img_doc_emp@2x.png";
import default_img_hospital from "@/assets/images/default/img_hos_emp@2x.png";

const pageMixins = {
  mixins: [dataCollectMixin],
  async asyncData({ redirect, route, store, query }) {
    // 获取详情
    let res = await communityService.findPlanById({ id: route.query.planId });
    let dataInfo = {};

    if (res.status == 200 && res.data) {
      dataInfo = res.data;
    }

    // 已删除、已撤销、或没内容时，跳转到404页面
    console.log("### Log appointment dataInfo: ");
    console.log(dataInfo);
    if (!dataInfo.status || dataInfo.status == 0 || dataInfo.status == 6) {
      return redirect("/notFound", {
        statusCode: 404,
        message: "内容找不到了",
      });
    }

    res = null;
    return {
      dataInfo
    };
  },
  components: {
    dialogEdit,
    dialogNone,
    dialogFilter,
    dialogArea,
    rate,
    pageLoading
  },
  data() {
    return {
      firstLoaded:false,//记录第一次加载
      oldScrollTop: 0,
      planId: "",
      dialogEditShow: false,
      dialogNoneShow: false,
      dialogFilterShow: false,
      dialogFilterShow2: false,
      dialogTimeShow: false,
      dialogAreaShow: false,
      dialogEditOptions: {},
      dialogFilterOptions: {},
      dialogNoneOptions: {},
      dialogFilterOptions2: {},
      dialogTimeOptions: {},
      dialogAreaOptions: {},
      defaultImg: defaultImg,
      test: 3.6,
      areaActive: {},
      brandActive: [],
      serviceActive: [],
      selectService: [],//预约时选择的具体项目(目前只支持单选)
      timeActive: {},
      allFilterObj: {},
      loading: false,
      isRefresh: false,
      dataInfo: {},
      channelList:[],
      dataList: [],
      total: 1,// 初始化为1
      params: {
        page: 0,
        size: 10
      },
      setTimeouter: null,
      firstDomContentLoadTime: 0
    };
  },
  watch: {
    isDialogShow(val) {
      if (val) {
        this.documentScrollTop("open");
      } else {
        $("body").removeClass("ios-fixed");
        this.documentScrollTop("close");
      }
    }
  },
  computed: {
    ...mapState({
      VX_userInfo: "userInfo",
      VX_comtyId: "comtyId",
      VX_token: "token",
      VX_location: "location",
    }),
    computed_default_hospital_banner(){
      let img="";
      let channelId=this.$route.query.channel;
      if(this.channelList.length>0&&channelId){
        let rslt =this.channelList.find((item)=>{
          return item.channel===channelId;
        });
        if(rslt){
          img = rslt.headImage ? rslt.headImage.url:"";
        }
      }
      return img;
    },
    isEnd() {
      return this.params.page >= Math.ceil(this.total / this.params.size);
    },
    isDialogShow() {
      return this.dialogEditShow
        || this.dialogFilterShow
        || this.dialogTimeShow
        || this.dialogAreaShow;
    },
    areaActiveName() {
      return this.areaActive.name || "正在获取位置...";
    },
    timeActiveName() {
      return this.timeActive.name || "不限日期，时段";
    },
    brandActiveName() {
      if (this.brandActive.length != 0) {
        return this.brandActive.map(a => { return a.name; }).join(",");
      } else {
        return "不限品牌";
      }
    },
    serviceActiveName() {
      if (this.serviceActive.length != 0) {
        return this.serviceActive.map(a => { return a.name; }).join(",");
      } else {
        return "全部项目";
      }
    },
  },
  filters: {
    filtersDistance(val, arr) {
      if (arr && arr.length != 0 && arr[0] === 0 && arr[1] === 0) {
        return "";
      }

      if (val > 1) {
        let hasDecimal = val.toString().indexOf(".") > -1;

        if (hasDecimal) {
          val = Math.floor(val * 100) / 100;
        }

        return val + "km";
      } else {
        return Math.floor(val * 1000) + "m";
      }

    },
    // filtersService(val) {
    //   let result = this.allFilterObj.security.filter(a => { a.id == val; });
    //   return result.length > 0 ? result[0].name : "";
    // },
    filtersProject(val) {
      let result = this.serviceActive.filter(a => { a.id == val; });
      return result.length > 0 ? result[0].name : "";
    },
  },
  created() {
    this.planId = this.$route.query.planId;
    this.getDetails();
    this.findBasicExtension();
    // this.getBrandListByPlanId();
    if (process.client) {
      window.addEventListener("beforeunload", e => this.unload());
    };
  },
  mounted() {
    this.initTips();

    if (this.$refs.dialogArea && this.$refs.dialogArea.$refs.iwenArea) {
      this.isRefresh = this.$refs.dialogArea.$refs.iwenArea.isRefresh;
    }

    this.windowScroll();

    this.autoFocusWeibo();

    // 打点
    this._dataCollect({
      contentId: this.planId,
      contentType: "13",
      operationType: "0"
    });
  },
  updated() {
    if (this.isEnd) {
      $(window).unbind("scroll");
    } else {
      this.windowScroll();
    }
  },
  beforeDestroy() {
    $(window).unbind("scroll");

    if (this.setTimeouter) {
      clearTimeout(this.setTimeouter);
    }
    // 页面加载完卸载
    if (this.firstDomContentLoadTime) {
      let sec = new Date().getTime();
      let duration = sec - this.firstDomContentLoadTime;
      console.log("页面停留时间" + duration);
      this._dataCollect({
        contentId: this.planId,
        contentType: "13",
        operationType: "8",
        duration: duration
      });
    }
  },
  methods: {
    unload() {
      if (this.firstDomContentLoadTime) {
        let sec = new Date().getTime();
        let duration = sec - this.firstDomContentLoadTime;
        console.log("页面停留时间" + duration);
        this._dataCollect({
          contentId: this.planId,
          contentType: "13",
          operationType: "8",
          duration: duration
        });
      }
    },
    autoFocusWeibo() {
      if (!this.$platformInfo.os.isWeibo) {
        return;
      }
      //sean 2.19 12 16 uid获取方式更改
      let uid = this.dataInfo.addFansUID;

      if (!uid) {
        return;
      }

      if (!this.$store.getters.isLogin) {
        return;
      }

      // 自动关注微博
      this.setTimeouter = setTimeout(() => {
        articleService.addFocusForPlan({
          userId: this.$store.state.userInfo.id,
          targetUid: uid,
          planId: this.planId,
        });
      }, 5000);

    },
    documentScrollTop(type) {
      /**
       * 注： 解决安卓、ios兼容问题
       * 1.安卓body使用overflow：hidden时，会回到顶部
       * 2.ios输入框聚焦时，虚拟键盘会把整个页面向上顶
       *
       * PS：程序执行顺序不能改（重要）
      * */
      // ios input虚拟键盘空白问题
      let ua = window.navigator.userAgent;
      let oldScrollTop = this.getScrollTop() || 0;
      let html = document.documentElement;
      let body = document.body;
      let ver = ua.match(/cpu iphone os (.*?) like mac os/i);
      let isIOS11 = "";

      // ios11 fixed布局的虚拟键盘会把input框遮住
      if (ver) {
        isIOS11 = ver[1].split("_")[0];
      }

      if (type == "open") {
        this.oldScrollTop = oldScrollTop;
        $("body").addClass("ios-fixed");

        // ios虚拟键盘问题
        if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) && isIOS11 != "11") {
          let timer = null;

          body.addEventListener("focusin", (e) => { // 聚焦
            clearTimeout(timer);
            timer = setTimeout(() => {
              body.scrollTop = body.clientHeight;
              html.scrollTop = html.clientHeight;
            }, 200);

          });

          body.addEventListener("focusout", () => { // 失焦
            clearTimeout(timer);
            timer = setTimeout(() => {
              body.scrollTop = this.oldScrollTop;
              html.scrollTop = this.oldScrollTop;
            }, 200);
          });
        }
      }

      body.scrollTop = this.oldScrollTop;
      html.scrollTop = this.oldScrollTop;

      // 安卓overflow：hidden问题
      if (this.$platformInfo.os.isAndroid) {
        let clientHeight = body.clientHeight;
        let top = this.oldScrollTop > clientHeight
          ? clientHeight / 3
          : this.oldScrollTop / 2;

        if (type == "open") {
          body.style.top = `-${top}px`;
        } else {
          body.style.top = "initial";
        }
      }
    },
    getScrollTop() {
      let scrollTop = 0;
      let ele = document.documentElement;

      if (ele && ele.scrollTop) {
        scrollTop = ele.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }

      return scrollTop;
    },
    getDetails() {
      communityService.findPlanById({ id: this.planId }).then(res => {

        if (res.status == 200 && res.data) {
          this.firstLoaded=true;
          this.channelList = res.data.channelList || [];
          this.dataInfo = res.data;
        }
      });
    },
    initTips() {
      // 0:已删除 1:未开始 2:报名中 3:准备投放中状态 4:投放中 5:已结束 6:已撤销
      let status = this.dataInfo.status || -1;
      status = Number(status);

      if (status == -1) {
        this.$toast.tip("暂无活动", "", 3000);
        return;
      }

      if ([0, 1, 2, 3].includes(status)) {
        this.$toast.tip("活动未开始", "", 3000);
        return;
      }

      if ([5, 6].includes(status)) {
        this.$toast.tip("活动已结束", "", 3000);
        return;
      }
    },
    filtersLabel(val, type) {
      // console.log("sdafdsdasfsa",type);
      let map = {
        0: "security",
        1: "service",
      };

      let result = this.allFilterObj[map[type]].filter(a => { return a.id == val; });
      return result.length > 0 ? result[0].name : "";
    },
    windowScroll() {
      if (process.server) {
        return;
      }

      let vm = this;
      $(window).scroll(function () {
        let scrollTop = $(this).scrollTop();
        let scrollHeight = $(document).height();
        let clientHeight = $(this).height();
        console.log("scorllllll3333", vm.dataList);

        if (scrollTop + clientHeight >= scrollHeight - 200) {
          console.log("scorllllll",vm.dataList);
          if (vm.dataList && vm.dataList.length>0){
            console.log("scorllllll2222");
            vm.getData();
          }
          
        }
      });
    },
    findBasicExtension() {
      communityService.findBasicExtension({ business: "mouth" }).then(res => {
        if (res.status == 200 && res.data) {
          this.allFilterObj = res.data;
          this.getBrandListByPlanId();
          this.getPlanProjectList();
        }
      });
    },
    getBrandListByPlanId() {
      communityService.getBrandListByPlanId({ planId: this.planId }).then(res => {
        if (res.status == 200 && res.data) {
          this.allFilterObj.brand = res.data;
        }
      });
    },
    getPlanProjectList() {
      communityService.getPlanProjectList({ planId: this.planId }).then(res => {
        if (res.status == 200 && res.data) {
          let service = res.data.map((item)=>{
            let  nItem={
              id: item.projectId,
              name: item.projectName,
              price: item.projectPrice,
              type:2
            };
            return nItem;
          });
          this.allFilterObj.service = service;
        }
      });
    },
    successDialogEdit() {
      this.dialogEditOptions.target.appointmentCount += 1;
    },
    openDialogEdit(item, type, timeObj) {
      if (type == "doctor" && !timeObj) {
        this.openDialogTime(item, type);
      } else {
        this.dialogEditShow = true;
        this.dialogEditOptions = {
          dataInfo: this.dataInfo,
          target: item,
          location: this.areaActive,
          service:this.selectService,
          time: timeObj || this.timeActive,
          type: type
        };
      }

    },
    openDialogFilter(type) {
      let list = this.allFilterObj[type] || [];
      let select = this[type + "Active"] || [];
      this.dialogFilterShow = true;
      this.dialogFilterOptions = {
        type: type,
        list: JSON.parse(JSON.stringify(list)),
        select: JSON.parse(JSON.stringify(select)),
      };
    },
    openDialogFilter2(item,tp) {
      let list =  [];
      this.selectService=[];
      communityService.getPlanAndHospitalProjectList({ planId: this.planId, hospitalId: item.hospitalId}).then(res => {
        if (res.status == 200 && res.data) {
          list = res.data.map((item) => {
            let nItem = {
              id: item.projectId,
              name: item.projectName,
              price: item.projectPrice,
              type:2
            };
            return nItem;
          });
          if(list.length>0){
            let select = [];
            this.dialogFilterShow = true;
            this.dialogFilterOptions = {
              type: "service",
              item: item,
              type2: tp,
              selectType: 2,
              list: JSON.parse(JSON.stringify(list)),
              select: JSON.parse(JSON.stringify(select)),
            };
          }else{
            this.dialogNoneShow = true;
            this.dialogNoneOptions = {
              type:tp
            };  
          }
        }
      });
     
    },
    openDialogTime(item, type) {
      this.dialogTimeShow = true;
      if (item) {
        this.dialogTimeOptions = {
          item: item,
          type: type,
          dataInfo: this.dataInfo,
          calendar: this.timeActive.calendar,
        };
      } else {
        this.dialogTimeOptions = this.timeActive;
      }
    },
    openDialogArea() {
      this.dialogAreaShow = true;
    },
    filterCallbck(params) {
      if (params.selectType && params.selectType==2){
        //单选模式
        if (params.select && params.select.length>0){
          this.selectService = params.select;
          this.openDialogEdit(params.item, params.type2);
        }
      }else{
        //多选模式
        this[params.type + "Active"] = params.select;
        this.reGetData(1);
      }
    },
    areaCallbck(params) {
      this.areaActive = params;
      this.isRefresh = false;
      this.reGetData(2);
    },
    timeCallbck(params) {
      if (params.options && params.options.item) {
        this.openDialogEdit(params.options.item, params.options.type, params);
      } else {
        this.timeActive = params;
        this.reGetData(3);
      }
    },
    refresh() {
      this.areaActive = "正在获取位置...";
      this.$refs.dialogArea.refresh();
      this.$refs.dialogArea.$refs.iwenArea.refresh(true);
    },
    reGetData(num) {
      // 重置查询条件
      console.log("reGetData",num);
      this.dataList = [];
      this.params.page = 0;
      this.params.size = 10;
      this.getData(num);
    },
    getOtherParams() {
      let projects = this.serviceActive.map(a => { return a.id; });
      let brands = this.brandActive.map(a => { return a.id; });
      let startTime = "";
      let endTime = "";

      if (this.timeActive.name && this.timeActive.startTime) {
        // time = new Date(this.timeActive.active.start).toISOString();
        // time = time.slice(0, 19).replace("T", " ");
        startTime = this.timeActive.startTime;
        endTime = this.timeActive.endTime;
      }

      return {
        planId: this.planId || "",
        provinceId: this.areaActive.provinceId || "",
        cityId: this.areaActive.cityId || "",
        districtId: this.areaActive.districtId || "",
        latitude: this.VX_location ? this.VX_location.lat : "0", // 纬度
        longitude: this.VX_location ? this.VX_location.lng : "0", // 经度
        projects: projects.join(",") || "",
        brands: brands.join(",") || "",
        startTime: startTime,
        endTime: endTime,
      };
    },
    getDefault_img(item, type, attr = "logo") {
      if (item[attr] && item[attr].url) {
        return item[attr].url;
      } else {
        const defaultImg = {
          "doctor": default_img_doc,
          "hospital": default_img_hospital,
        };
        return defaultImg[type];
      }
    },
    injectDomLoadTime() {
      //初次加载打点
      if (!this.firstDomContentLoadTime) {
        this.$nextTick(() => {
          //
          // 页面完成加载时
          let sec = new Date().getTime();
          console.log("首页页面加载数据当前时间 " + sec);
          this.firstDomContentLoadTime = sec;

          this._dataCollect({
            contentId: this.planId,
            contentType: "13",
            operationType: "6"
          });
          let dom_load = sec - performance.timing.navigationStart;
          console.log("首次完全加载完+" + dom_load);
          this._dataCollect({
            contentId: this.planId,
            contentType: "13",
            operationType: "7",
            duration: dom_load
          });
        });
      }
    }
  },
  head() {
    let query = this.$route.query;
    let innerHTML = "";
    let innerHTML2 = "";
    let baidu = "";

    // 百度统计代码
    baidu = `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?208129ec37e3c56a3bb782e1cdf87e5c";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `;

    if (query && query.form) {
      innerHTML = `
          ;(function(){
            var _third_ua = navigator.userAgent;
            var _third_app = navigator.appVersion;
            var _third_isMobile = !!_third_ua.match(/AppleWebKit.*Mobile.*/);
            if(!_third_isMobile) {
              location.href= "http://liugp.syqyzy.cn/"
            }
          })();
        `;
    }

    // 收集表单
    if (query && query.channel && query.channel == 1) {
      innerHTML2 = `
        window._agl = window._agl || [];
        (function () {
            _agl.push(
                ['production', '_f7L2XwGXjyszb4d1e2oxPybgD']
            );
            (function () {
                var agl = document.createElement('script');
                agl.type ='text/javascript';
                agl.async = true;
                agl.src = 'https://fxgate.baidu.com/angelia/fcagl.js?production=_f7L2XwGXjyszb4d1e2oxPybgD';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(agl, s);
            })();
        })();
        `;
    }

    return {
      title: this.dataInfo ? (this.dataInfo.name || "") : "",
      script: [
        {
          type: "text/javascript",
          innerHTML: innerHTML,
        },
        {
          type: "text/javascript",
          innerHTML: innerHTML2,
        },
        {
          type: "text/javascript",
          innerHTML: baidu,
        }
      ],
      __dangerouslyDisableSanitizers: ["script"]
    };
  }
};

export default pageMixins;
