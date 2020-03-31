import request from "~/request";

let interfaces = [
  // 文章
  { type: "post", name: "saveAction", url: "/api/article/saveAction" },// 文章点赞、取消点赞，点水、取消点水
  { type: "post", name: "queryAllArticleTypes", url: "/api/article/queryAllArticleTypes" },//全部文章类型列表
  { type: "post", name: "queryListPaged", url: "/api/article/queryListPaged" },// 查询文章分页列表
  { type: "post", name: "articleInfo", url: "/api/article/getInfoById" },// 查询某文章的详细信息
  { type: "get", name: "getVideoInfo", url: "/api/article/getVideoInfo" },// 查询视频详细信息
  { type: "post", name: "relativeArticleList", url: "/api/article/getRelativeArticle" },// 获取当前文章相关文章
  { type: "post", name: "getRelativePosts", url: "/api/article/getRelativePosts" },// 获取当前文章相关帖子
  { type: "post", name: "videoDataCollect", url: "/api/article/dataCollect" },// 视频点赞接口

  // 文章分享页
  { type: "get", name: "getAdvertiseMent", url: "/api/communityArticleShare/getAdvertiseMent" },// 查询文章分享页广告位相关信息
  { type: "get", name: "getArticleList", url: "/api/communityArticleShare/getArticleList" },// 查询社区文章分享扩展文章列表
  { type: "get", name: "getCommunityConfig", url: "/api/communityArticleShare/getCommunityConfig" },// 查询社区咨询室配置信息
  { type: "get", name: "getWeiBoInfo", url: "/api/communityArticleShare/getWeiBoInfo" },// 根据id查询微博用户信息

  // 问卷调查
  { type: "post", name: "addCommunityQuestionAnswer", url: "/api/questionAnswer/addCommunityQuestionAnswer" },// 保存问卷回答
  { type: "get", name: "getQuestionnaireDetails", url: "/api/questionAnswer/getQuestionnaireDetails" },// 问卷详情（问答详情列表）
  { type: "get", name: "getUserIsQuestionAnswer", url: "/api/questionAnswer/getUserIsQuestionAnswer" },// 查询用户是否填写过问卷

  // 医医讲堂
  { type: "post", name: "addLabelToVideoForUser", url: "/api/communityVideo/addLabelToVideoForUser" },// 给用户对于单个视频添加标签
  { type: "get", name: "findVideoById", url: "/api/communityVideo/findVideoById" },// 查询单个视频信息
  { type: "get", name: "pageVideo", url: "/api/communityVideo/pageVideo" },// 分页查询视频列表
  { type: "get", name: "findVideoCommentPage", url: "/api/communityVideo/findVideoCommentPage" },// 视频精彩评论
  { type: "post", name: "addOrUpdateComment", url: "/api/communityVideo/addOrUpdateComment" },// 新增/更新-视频评论
  { type: "get", name: "findVideoForApp", url: "/api/communityVideo/findVideoForApp" },// 查询全部社区视频
  { type: "post", name: "updateDoctorVideo", url: "/api/communityVideo/updateDoctorVideo" },// 更新邀请列表里的医生观看视频进度

  // 其他
  { type: "get", name: "findRedisByKey", url: "/api/redisServer/findRedisByKey" },// 公共服务 - 数据缓存查询
  { type: "post", name: "addFocusForLanV", url: "/api/weiboFocus/addFocusForLanV" },// 分享页自动关注微博蓝V
  { type: "post", name: "addFocusForPlan", url: "/api/weiboFocus/addFocusForPlan" },// 访问预约推广计划，为手动绑定的uid加粉
];

export default request.apiCreator(request, interfaces);
