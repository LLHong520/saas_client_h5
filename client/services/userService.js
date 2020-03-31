import request from "~/request";

let interfaces = [
  // 我的消息
  { type: "get", name: "getmyinfo", url: "/api/user/myInfo" },// 当前登录用户消息数目
  { type: "get", name: "myMessageNum", url: "/api/message/myMessageNum" },
  { type: "get", name: "getDynamicListByUserId", url: "/api/system/getDynamicListByUserId" },// 用户动态列表
  { type: "get", name: "getMessageList", url: "/api/message/getMyMessageList" },// 我的消息列表
  { type: "get", name: "getMyMessageDetail", url: "/api/message/getMyMessageDetail" },// 我的消息详情
  { type: "get", name: "getMyMessageDetailPosts", url: "/api/message/getMyMessageDetailPosts" },// 我的消息详情（文章标题用户）
  { type: "get", name: "getMyMessageDetailReplys", url: "/api/message/getMyMessageDetailReplys" },// 我的消息详情（回复）
  { type: "get", name: "getMyMessageDetailPostsReply", url: "/api/message/getMyMessageDetailPostsReply" },// 我的消息详情（定位回复）

  // 注册
  { type: "post", name: "checkNikename", url: "/api/user/checkNikename" },// 检测昵称是否存在
  { type: "get", name: "sendCode", url: "/api/auth/sendCode" },// 注册发送验证码
  { type: "post", name: "regsiter", url: "/api/user/regsiter" },// 用户注册
  { type: "post", name: "login", url: "/api/auth/login" },// 用户登陆
  { type: "post", name: "logOut", url: "/api/user/logOut" },// 用户退出登陆
  { type: "get", name: "checkMobile", url: "/api/user/checkMobile" }, // 检测手机号是否存在(true:已存在、false:不存在)

  // 个人信息
  { type: "post", name: "bindMobile", url: "/api/user/bindMobile" },// 绑定手机号
  { type: "get", name: "getUserinfo", url: "/api/user/userInfo" },// 获取个人信息
  { type: "post", name: "updateMyinfo", url: "/api/user/updateMyinfo" },// 编辑个人信息
  { type: "post", name: "updateMobile", url: "/api/user/updateMobile" },// 修改手机号

  // app用户登录
  { type: "get", name: "doctorLogin", url: "/api/auth/login/customer" },// APP端用户直接登录
  { type: "post", name: "doctorJoinComty", url: "/api/commty/joinCommunity" },// APP端用户医生加入社区
  { type: "get", name: "checkNikeName", url: "/api/user/checkNikeName" },// APP端用户医生加入社区
  { type: "get", name: "getUserFromType", url: "/api/user/from/type" },// 获取用户的fromeType

  // 第三方信息绑定
  { type: "post", name: "thirdBindMobile", url: "/api/user/third/bindMobile" },// 第三方账号登录后绑定手机号
  { type: "post", name: "bindThirdUser", url: "/api/user/third/bindThirdUser" },// 绑定第三方用户(微博，微信)
  { type: "post", name: "unBindThirdUser", url: "/api/user/third/unBindThirdUser" },// 解绑第三方用户信息(微信，微博)复制

  // 其他
  { type: "get", name: "getIdentity", url: "/api/system/getValue" },
  { type: "post", name: "getUserPostList", url: "/api/user/getUserPostList" },// 获取用户的帖子列表
  { type: "get", name: "setMessageReaded", url: "/api/message/setMessageReaded" },// 设置消息已读
  { type: "get", name: "uploadImg", url: "/api/system/uploadImg" },// 上传图片
  { type: "get", name: "joinInComty", url: "/api/community/joinIn" },// 加入社区
  { type: "post", name: "userSurvey", url: "/api/user/survey" },// 用户填写问卷
];

export default request.apiCreator(request, interfaces);
