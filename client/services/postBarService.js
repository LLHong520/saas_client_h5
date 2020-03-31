import request from "~/request";

let interfaces = [
  // 帖子
  { type: "get", name: "getPostBarInfo", url: "/papi/postbar/getPostBarById" },// 获取圈子基础信息
  { type: "post", name: "getPostAdminUserByList", url: "/papi/postbar/adminuser/getPostAdminUserByList" },// 获取圈子圈主列表
  { type: "post", name: "getPostTagsByList", url: "/papi/postbar/posttags/getPostTagsByList" },// 获取圈子标签列表
  { type: "get", name: "getTopPostsList", url: "/papi/postbar/posts/getTopPostsList" },// 获取圈子置顶帖子列表
  { type: "get", name: "getPostsCount", url: "/papi/postbar/posts/getPostsCount" },// 获取圈子帖子总数
  { type: "post", name: "getPostBarExpertUserByPage", url: "/papi/postbar/expertuser/getExpertUserByPage" },// 获取圈子委员会列表
  { type: "post", name: "getPostsByPage", url: "/papi/postbar/posts/getPostsByPage" },// 获取圈子帖子列表
  { type: "post", name: "getPostBarByList", url: "/papi/postbar/getPostBarByList" },// 获取社区的圈子列表
  { type: "get", name: "getPostsById", url: "/papi/postbar/posts/getPostsById" },// 获取社区圈子详情
  { type: "post", name: "getPostReplyByPage", url: "/papi/postbar/reply/getPostReplyByPage" },// 获取社区帖子回复列表
  { type: "post", name: "addPostReply", url: "/papi/postbar/reply/addPostReply" },// 新建帖子评论
  { type: "delete", name: "removeByIdReply", url: "/papipostbar/reply/removePostReplyById" },// 删除帖子评论
  { type: "post", name: "sendReplyMsg", url: "/papi/msg/postreply/sendReplyMsg" },// 新建帖子评论给相关人员发消息
  { type: "post", name: "getPostReplyCount", url: "/papi/postbar/reply/getPostReplyCount" },// 帖子评论数目
  { type: "put", name: "setTopById", url: "/papi/postbar/posts/setTopById" },// 帖子置顶取消置顶
  { type: "put", name: "setRecommendById", url: "/papi/postbar/posts/setRecommendById" },// 帖子执行推荐取消推荐
  { type: "put", name: "setEssenceById", url: "/papi/postbar/posts/setEssenceById" },// 精华取消精华
  { type: "delete", name: "removeById", url: "/papi/postbar/posts/removeById" },// 删除帖子
  { type: "post", name: "getExpertReplyList", url: "/papi/postbar/reply/getExpertReplyList" },// 获取专家点评列表
  { type: "post", name: "addPosts", url: "/papi/postbar/posts/addPosts" },// 发布--新建帖子
  { type: "post", name: "updatePosts", url: "/papi/postbar/posts/updateById" },// 发布--编辑帖子
  { type: "get", name: "getAdminUserActionById", url: "/papi/postbar/posts/getAdminUserActionById" },// 获取帖子圈主编辑信息
];

export default request.apiCreator(request, interfaces);
