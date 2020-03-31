import request from "~/request";

let interfaces = [
  // 上传
  { type: "postFile", name: "uploadImg", url: "/api/system/uploadImg" },// 上传图片
  { type: "postFile", name: "imgUpload", url: "/api/system/img/upload" },// 上传图片
  { type: "postUrl", name: "uploadToAliyun", url: "myurl" },
  { type: "get", name: "getUploadUrl", url: "/api/system/getFileUploadUrl" },

  // 新闻
  { type: "post", name: "queryList", url: "/api/message/queryList" },// 公告列表
  { type: "get", name: "getNewsAndNotices", url: "/api/news/getNewsAndNotices" },// 新闻列表
  { type: "get", name: "getNewsAndNoticesInfo", url: "/api/news/getNewsDetailedById" },// 新闻详情

  // 打点
  { type: "post", name: "dataPvUvcollect", url: "/api/data/datapvuvcollect" },// 数据打点
  { type: "postUrl", name: "addUserOperationRecord", url: "/api/userOperationRecord/addUserOperationRecord" },// 记录用户数据
  { type: "post", name: "addVisitor", url: "/api/communityArticleShare/addVisitor" },// 添加广告点击打点

  // 打点（新）
  { type: "get", name: "isOperate", url: "/api/community/data/isOperate" },// 查询是否已进行操作
  { type: "post", name: "receive", url: "/api/community/data/receive" },// 记录打点

  // 其他
  { type: "get", name: "getPostBarById", url: "/api/postbar/getPostBarById" },// 圈子信息
  { type: "get", name: "getChannelKey", url: "/api/system/getValue" },// 获取产品使用key
  { type: "get", name: "getQrCodeImage", url: "/api/system/getQrCodeImage" },
  { type: "get", name: "getChannelCollect", url: "/api/data/getChannelCollect" },
  { type: "get", name: "getWxConfig", url: "/weixin/v1/getJsApiTick" },
  { type: "post", name: "weiboAddFocus", url: "/api/weiboFocus/addFocus" },
  { type: "get", name: "checkInfoByToken", url: "/api/auth/login/checkInfoByToken" },
  { type: "get", name: "judgeCheckNum", url: "/api/auth/judgeCheckNum" }, // 校验验证码

  // 发送验证码（新）
  { type: "post", name: "sendSms", url: "/api/sms/sendSms" }, // 发送验证码
];

export default request.apiCreator(request, interfaces);
