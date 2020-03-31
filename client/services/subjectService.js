import request from "~/request";

let interfaces = [
  // 专题
  { type: "get", name: "subjectList", url: "/api/subject/queryListPaged" },// 查询专题分页列表
  { type: "get", name: "subjectInfo", url: "/api/subject/getInfoById" },// 查询某专题的详细信息
  { type: "get", name: "subjectArticleList", url: "/api/subject/getArticleListById" },// 获取专题的文章列表
  { type: "get", name: "subjectPostList", url: "/api/subject/getRelativePosts" },// 获取当前专题相关帖子
  { type: "get", name: "relativeSubjects", url: "/api/subject/getSubjectRelevant" },// 获取当前专题相关专题
];

export default request.apiCreator(request, interfaces);
