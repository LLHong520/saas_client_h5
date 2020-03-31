import sysService from "@/services/sysService.js";
// import tools from "@/utils/index.js";

const wxTemplateMsgMixin = {
  methods: {
    saveFormIdByUserId(params={}) {
      if (!params.formId || params.formId.indexOf("formId") > -1) {
        return;
      }

      if (this.VX_is_login){
        sysService.saveFormIdByUserId({
          toUserId: this.VX_userInfo.id,
          formId: params.formId,
        });
      }else{
        console.log("用户未登陆无法保存");
      }
    },
    sendWxTemplateMessage(params = {}) {
      let templateIds = [
        // "NXqL5yFXI8zC7P5KALQ6VT7IB1p3BuVU0qe_A4XR2qg", //帖子被评论
        // "GVg2N9D4bWmJ5hy8EdrIDvCF9XtLQ1kkXtRfCgT1yHI", //评论被回复
        "Putl8rJMxlleqRjkdl0X4OBc_r-XrwDBacvhvjZHy5I", //帖子被评论
        "eehX1GVj7TxHan2fbXmQZon6iG2ExT66HzUkN-znkY0", //评论被回复
      ];
      sysService.sendWxTemplateMessage({
        toUserId: params.toUserId,
        templateId: templateIds[params.type],
        pageUrl: params.pageUrl,
        data: params.data,
        emphasis_keyword: params.emphasis_keyword
      });
    },
    sendWxMessage(data, { type, toUserId, pageUrl }) {
      //微信模板消息
      let params = {
        type,
        toUserId,
        pageUrl,
        data:data,
        emphasis_keyword: "keyword1.DATA"
      };
      this.sendWxTemplateMessage(params);
    }
  }
};

export default wxTemplateMsgMixin;
