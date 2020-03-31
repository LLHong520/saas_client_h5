import request from "~/request";

let interfaces = [
  // 医生
  { type: "post", name: "docList", url: "/api/doctor/queryListPaged" },//查询医生分页列表
  { type: "get", name: "docInfo", url: "/api/doctor/getInfoById" },// 查询某医生的个人信息
  { type: "post", name: "docIntro", url: "/api/doctor/getInstorInfoById" },// 获取医生介绍信息
  { type: "post", name: "docNewsList", url: "/api/doctor/getDynamicListById" },// 获取医生的动态列表
  { type: "post", name: "docArticleList", url: "/api/doctor/getArticleListById" },// 获取医生的文章列表
  { type: "post", name: "getPostList", url: "/api/doctor/getPostListById" },// 获取医生的帖子列表
  { type: "get", name: "docDepartList", url: "/api/system/getDoctorDepartmentById" },// 获取医生的科室列表
  { type: "get", name: "getDoctorRegionList", url: "/api/system/getDoctorRegionList" },// 获取医生的地区列表

  // 诊所推荐
  { type: "get", name: "pageConsultaion", url: "/api/communityConsultation/pageConsultaion" },// 分页查询社区诊室信息
  { type: "get", name: "pageConsultaionMap", url: "/api/communityConsultation/pageConsultaionMap" },// 分页查询社区诊室信息 -- map
  { type: "get", name: "getConsultationInfo", url: "/api/communityConsultation/getConsultationInfo" },// 查询诊室详情
  { type: "get", name: "getPlaceList", url: "/api/communityConsultation/getPlaceList" },// 查询地区相关信息
  { type: "get", name: "getClinicDoctorList", url: "/api/communityConsultation/getClinicDoctorList" },// 获取对应社区诊所的医生列表
  { type: "get", name: "getClinicActivityList", url: "/api/communityConsultation/getClinicActivityList" },// 查询诊所活动列表
  { type: "get", name: "getHospitalDepart", url: "/api/communityConsultation/getHospitalDepart" },// 获取社区医院的医生科室并排序
  { type: "get", name: "findClinicDoctorByQuery", url: "/api/communityConsultation/findClinicDoctorByQuery" },// 查询医院推荐-医生信息

  // 邀请医生 - 站内消息
  { type: "get", name: "findClinicDoctorByQuery", url: "/api/communityConsultation/findClinicDoctorByQuery" },// 查询单个爱问医生信息
  { type: "get", name: "updateClinicDoctor", url: "/api/communityConsultation/updateClinicDoctor" },// 医院推荐更新医生信息
  { type: "get", name: "getStationMsg", url: "/api/comtyMsg/getStationMsg" },// 查询站内信息
];

export default request.apiCreator(request, interfaces);
