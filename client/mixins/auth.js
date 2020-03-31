import { docComtyIds } from "~/middleware/doc_comty_checklogin.js";

const authMixin = {
  methods: {
    checkUserStatus(status) {
      // 检查用户是否被禁用
      if (status && status != 0) {
        this.$store.dispatch("user_logout");
        this.$router.push({
          path: "/notFound",
          query:{
            statusCode:410,
            message:"您的账号已被停用",
            showHeader:false
          }
        });
        return true;
      }

      return false;
    },
    async checkInfoByToken(token, query){
      // 医生社区时，需要判断是够该社区医生
      await this.$store.dispatch("update_isDoctor", token);
      query = query || this.$route.query;

      let comtyId = query.comtyId || "";
      let isDoctor = this.$store.state.isDoctor;
      let isDocComtyIds = docComtyIds.indexOf(comtyId) > -1;

      if(!isDoctor && isDocComtyIds){
        this.router_replace("/docForbidTip");
        return false;
      }

      if (!isDocComtyIds) {
        return true;
      } else {
        return isDoctor;
      }
    },
  }
};

export default authMixin;
