var tools = require("../tools.js");
module.exports = [
  {
    url: "/community/enrolledDoctorInfo", //入驻医生列表
    method: "get",
    mockdata: {
      "doctorNum": 10,
      "list": [{
        "id": 15,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }, {
        "id": 16,
        "name": "唐僧1",
        "faceimage": tools.getAvater(),
      }, {
        "id": 17,
        "name": "唐僧2",
        "faceimage": tools.getAvater(),
      }]
    }
  },
  {
    url: "/community/enrolledUserInfo", //用户列表
    method: "get",
    mockdata: {
      "totalNum": 10,
      "list": [{
        "id": 15,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }, {
        "id": 15,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }, {
        "id": 16,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }, {
        "id": 17,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }, {
        "id": 18,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }, {
        "id": 19,
        "name": "唐僧",
        "faceimage": tools.getAvater(),
      }]
    }
  },
  {
    url: "/community/getCommunityInstro", //社区介绍
    method: "get",
    mockdata: {
      "corporateName": "公司名称2",
      "comtyFatherId": "5bdbfe0bc53caf34081d1eb5",
      "comtyName": "lidy社区2",
      "comtySonId": "5bdbfed0c53caf34081d1eba",
      "qrCode": "",
      "createTime": 1542186136418,
      "auditStatus": "1",
      "id": "5bebe498c53caf13e43c91b6",
      "bId": "5beacb5ac53caf2cc89909fb",
      "introduction": "社区描述2",
      "status": "1"
    }
  }
];
