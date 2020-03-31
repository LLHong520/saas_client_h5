import find_icon_essay from "~/assets/images/app_icons/find_icon_essay@2x.png";
import find_icon_special from "~/assets/images/app_icons/find_icon_special@2x.png";
import find_icon_post from "~/assets/images/app_icons/find_icon_post@2x.png";
import find_icon_trial from "~/assets/images/app_icons/find_icon_trial@2x.png";
import find_icon_trial_off from "~/assets/images/app_icons/find_icon_trial_off@2x.png";
import find_icon_news from "~/assets/images/app_icons/find_icon_news@2x.png";
import find_icon_comm from "~/assets/images/app_icons/find_icon_comm@2x.png";
import find_icon_comm_on from "~/assets/images/app_icons/find_icon_comm_on@2x.png";
import find_icon_live from "~/assets/images/app_icons/find_icon_live@2x.png";
import find_icon_live_on from "~/assets/images/app_icons/find_icon_live_on@2x.png";
import find_icon_refer from "~/assets/images/app_icons/find_icon_refer@2x.png";
import find_icon_refer_on from "~/assets/images/app_icons/find_icon_refer_on@2x.png";
import find_icon_chair from "~/assets/images/app_icons/find_icon_chair@2x.png";
import find_icon_chair_on from "~/assets/images/app_icons/find_icon_chair_on@2x.png";
// import find_icon_analyze from "~/assets/images/app_icons/find_icon_analyze@2x.png";
// import find_icon_analyze_on from "~/assets/images/app_icons/find_icon_analyze_on@2x.png";
import find_icon_cr from "~/assets/images/app_icons/find_icon_cr@2x.png";
import find_icon_cr_on from "~/assets/images/app_icons/find_icon_cr_on@2x.png";
import find_icon_clinic_on from "~/assets/images/app_icons/find_icon_clinic_on@2x.png";
import find_icon_dsp from "~/assets/images/app_icons/find_icon_dsp@2x.png";
// import find_icon_ad from "~/assets/images/app_icons/find_icon_ad@2x.png";
const apps = [{
  icon: find_icon_essay,
  label: "健康科普",
  posType: 0,
  path: "/article",
  isOnline: true,
},
{
  icon: find_icon_special,
  label: "科普专题",
  posType: 1,
  path: "/subjects",
  isOnline: true,
},
{
  icon: find_icon_post,
  label: "圈子",
  posType: 2,
  path: "/tieba",
  isOnline: true,
},
{
  icon: find_icon_live_on,
  icon_off: find_icon_live,
  label: "直播",
  posType: 3,
  path: "",
  isOnline: false,
},
{
  icon: find_icon_comm_on,
  icon_off: find_icon_comm,
  label: "调查问卷",
  posType: 4,
  path: "/find/benefit",
  isOnline: false,
},
{
  icon: find_icon_news,
  label: "健康知识",
  posType: 5,
  path: "/news?type=1",
  isOnline: true,
},
{
  icon: find_icon_news,
  label: "资讯公告",
  posType: 6,
  path: "/news?type=2",
  isOnline: true,
},
{
  icon: find_icon_chair_on,
  icon_off: find_icon_chair,
  label: "医医讲堂",
  posType: 7,
  path: "/video",
  isOnline: true,
},
{
  icon: find_icon_dsp,
  label: "DSP推广",
  posType: 8,
  path: "",
  isOnline: false,
},
/*{
  icon: find_icon_analyze_on,
  icon_off: find_icon_analyze,
  label: "病例分析",
  posType: 8,
  path: "",
  isOnline: false,
},*/
{
  icon: find_icon_cr_on,
  icon_off: find_icon_cr,
  label: "咨询室",
  posType: 9,
  path: "/iframe?key=consulting_room",
  isOnline: false,
},
{
  icon: find_icon_trial,
  icon_off: find_icon_trial_off,
  label: "产品试用",
  posType: 10,
  // path: "http://try.healthleague.cn/index.html?f=",
  path: "https://try.pingcl.com/index/",
  isOnline: false,
},

{
  icon: find_icon_clinic_on,
  // icon_off: find_icon_clinic_on,
  label: "医院推荐",
  posType: 11,
  path: "/find/hospital",
  isOnline: true,
},
{
  icon: find_icon_refer_on,
  icon_off: find_icon_refer,
  label: "图文咨询",
  posType: 12,
  path: "",
  isOnline: false,
},
{
  icon: find_icon_refer_on,
  icon_off: find_icon_refer,
  label: "电话咨询",
  posType: 13,
  path: "",
  isOnline: false,
},
{
  icon: find_icon_refer_on,
  icon_off: find_icon_refer,
  label: "门诊预约",
  posType: 14,
  path: "",
  isOnline: false,
},
{
  icon: find_icon_comm_on,
  icon_off: find_icon_comm,
  label: "公益活动",
  posType: 15,
  path: "/find/benefit",
  isOnline: false,
},
// {
//   icon: find_icon_dsp,
//   label: "DSP推广",
//   posType: 9,
//   path: "",
//   isOnline: false,
// },
// {
//   icon: find_icon_ad,
//   label: "广告营销",
//   posType: 10,
//   path: "",
//   isOnline: false,
// },
];

export default apps;
