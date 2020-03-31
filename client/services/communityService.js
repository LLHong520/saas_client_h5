import request from "~/request";

let interfaces = [
  // 社区信息
  { type: "get", name: "enrolledDoctorInfo", url: "/api/community/enrolledDoctorInfo" },// 入驻医生信息
  { type: "get", name: "getUserList", url: "/api/community/enrolledUserInfo" },// 用户列表
  { type: "get", name: "getCommunityInstro", url: "/api/community/getCommunityInstro" },// 社区介绍
  { type: "get", name: "getCommunityUserCount", url: "/api/community/getCommunityUserCount" },// 获取社区用户数
  { type: "get", name: "isJoinCommunity", url: "/api/community/isJoinCommunity" },// 获取是否已经加入社区
  { type: "get", name: "getCommunityDocAndProInfo", url: "/api/communityIntroducePage/getCommunityDocAndProInfo" },// 查询社区介绍页医生和产品列表

  // 预约
  { type: "post", name: "addAppointment", url: "/api/appointment/addAppointment" },// 试验版预约
  { type: "post", name: "addPlanForm", url: "/api/appointment/addPlanForm" },// 提交预约计划表单
  { type: "get", name: "findBasicExtension", url: "/api/appointment/findBasicExtension" },// 根据条件查询预约扩展字典数据
  { type: "get", name: "getBrandListByPlanId", url: "/api/appointment/getBrandListByPlanId" },// 参与预约计划的品牌
  { type: "get", name: "getPlanProjectList", url: "/api/appointment/getPlanProjectList" },// 参与预约计划的项目
  { type: "get", name: "getPlanAndHospitalProjectList", url: "/api/appointment/getPlanAndHospitalProjectList" },// 该预约计划单独医院参加的项目
  { type: "get", name: "findPlanById", url: "/api/appointment/findPlanById" },// 预约计划详情
  { type: "get", name: "pageDoctorList", url: "/api/appointment/pageDoctorList" },// 试验版预约
  { type: "get", name: "pageDoctorList", url: "/api/appointment/pageDoctorList" },// 查询计划的医生列表
  { type: "get", name: "pageHospitalList", url: "/api/appointment/pageHospitalList" },// 查询计划的医院列表
  { type: "get", name: "findDoctorTimesById", url: "/api/appointment/findDoctorTimesById" },// 查询计划的医生列表医生时间
  { type: "get", name: "findComtyListBySearch", url: "/api/community/findComtyListBySearch" },// 搜索社区
  //牙齿测试v_tooth_1
  { type: "post", name: "addStaticUid", url: "/api/appointment/addStaticUid" },// 收集微博uid
  { type: "post", name: "addUserInfo", url: "/api/appointment/addUserInfo" },// 微博提交预约
  //牙齿测试v_tooth_2
  { type: "post", name: "addCollectUidRecord", url: "/api/collectUidRecord/addCollectUidRecord" },// 收集微博uid
  { type: "post", name: "addFansForStaticPage", url: "/api/weiboFocus/addFansForStaticPage" },// 加粉接口
  { type: "post", name: "sendPrivateMsgForStaticPage", url: "/api/weiboFocus/sendPrivateMsgForStaticPage" },//发送私信接口
  { type: "post", name: "addRecord", url: "/api/pageOperationRecord/addRecord" },//操作记录打点

];

export default request.apiCreator(request, interfaces);
