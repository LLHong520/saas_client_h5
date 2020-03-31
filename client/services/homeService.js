import request from "~/request";

let interfaces = [
  // 首页
  { type: "post", name: "getBannerPosSet", url: "/api/homepage/getBannerPosSet" },// banner
  { type: "post", name: "getSubjectSet", url: "/api/homepage/getSubjectSet" },// 首页专题推荐位设置
  { type: "post", name: "getRecommendPosSet", url: "/api/homepage/getRecommendPosSet" },// 首页主功能推荐位设置
  { type: "post", name: "getDocPosSet", url: "/api/homepage/getDocPosSet" },//首页医生推荐位设置
  { type: "post", name: "getChannelSet", url: "/api/homepage/getChannelSet" },// 首页推广渠道列表
  { type: "post", name: "getArticleSet", url: "/api/homepage/getArticleSet" },// 首页文章推荐位设置
  { type: "post", name: "getModuleSort", url: "/api/homepage/getModuleSort" },// 首页模块排序
  { type: "post", name: "getPostbarSet", url: "/api/homepage/getPostbarSet" },// 首页圈子设置
  { type: "post", name: "getVideoSet", url: "/api/homepage/getVideoSet" },// 查询首页视频推荐位设置
  { type: "post", name: "getUserList", url: "/api/community/enrolledUserInfo" },// 入驻用户列表
  { type: "get", name: "getCommunityDescribe", url: "/api/homepage/getCommunityDescribe" },// 获取社区简介
  //搜索
  { type: "get", name: "getIndexContentByTitle", url: "/api/communityIndex/getIndexContentByTitle" },// 获取社区简介
  // 知识公告
  { type: "get", name: "getHealthInfo", url: "/api/communityIndex/getHealthInfo" },// 获取首页健康信息
  { type: "get", name: "getHealthLabels", url: "/api/communityIndex/getHealthLabels" },// 随机获取社区标签列表
  { type: "get", name: "getHealthScienceByTitle", url: "/api/communityIndex/getHealthScienceByTitle" },// 分页获取健康科普
  { type: "get", name: "findHealthInfo", url: "/api/communityIndex/findHealthInfo" },// 获取单个健康信息
  { type: "get", name: "pageHealthInfo", url: "/api/communityIndex/pageHealthInfo" },// 分页获取健康科普
];

export default request.apiCreator(request, interfaces);
