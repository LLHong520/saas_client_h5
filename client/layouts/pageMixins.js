import permission from "~/mixins/permission";
import excludeLinks from "~/consts/excludeLinks.js";

const pageMixins = {
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.initPermission();
      },
      deep: true
    }
  },
  created() {
    this.initPermission();
  },
  beforeMount() {
    // 进callback页面时，不更新
    if (this.$route.path.indexOf("/callback") == -1 ) {
      this.$store.dispatch("update_localStorage");
    }
  },
  mounted() {
    // this.checkUserPhone();
  },
  methods: {
    initPermission() {
      // 初始化权限
      let isExclude = this.checkExclude();

      // 注: nuxtServerInit已清空store，所以这里要使用$route
      if (process.client && isExclude && this.$route.query && this.$route.query.comtyId) {
        permission.init("", {
          route: this.$route,
          redirect: window.location.replace,
          store: this.$store,
        });
      }
    },
    checkExclude() {
      // 检查不需要社区id的链接
      let { query, path } = this.$route;
      let isExclude = excludeLinks.some( a => { return path.indexOf(a) != -1; });
      let hasComtyId = (query && query.comtyId) || this.$store.state.comtyId;

      return hasComtyId && !isExclude;
    },
    checkUserPhone() {
      // 检查用户是否已经绑定手机，否：则强制跳转到绑定手机页面
      if (process.client) {
        let state = this.$store.state;
        let getters = this.$store.getters;

        // 第三方绑定手机操作
        let phoneToken = localStorage.getItem("phoneToken");

        if (this.$route.path  == "/login/bindPhone" || phoneToken) {
          return;
        }

        if (getters.isInApp || getters.isInSinaHealApp) {
          return;
        }

        if (getters.isLogin && state.userInfo && !state.userInfo.phoneNum) {
          window.location.replace("/login/bindPhone");
        }
      }
    },
  }
};

export default pageMixins;
