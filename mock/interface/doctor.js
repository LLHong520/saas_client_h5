var tools = require("../tools.js");
module.exports = [
  {
    url: "/doctor/queryListPaged", //医生列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            "id": i,
            "aiwen_id": tools.getDocId(),
            "name": tools.getName(),
            "departName": tools.getDocDepart(),
            "hospitalName": tools.getDocHospital(),
            "title": tools.getDocTitle(),
            "goodAt": "儿科内科，新生儿张发，儿科感冒，儿科腹泻，儿科肠胃炎，儿科骨科等等",
            "faceimage": tools.getAvater(),
            "sourceType": "二维码邀请",
            "articleNum": 1000,
            "postNum": 1000,
            "commentNum": 1000
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/doctor/getInfoById", //医生个人信息
    method: "post",
    mockdata: {
      "status": 0,
      "message": "查询成功",
      "data": {
        "id": 1,
        "aiwen_id": tools.getDocId(),
        "name":tools.getName(),
        "departName": tools.getDocDepart(),
        "hospitalName": tools.getDocHospital(),
        "title": tools.getDocTitle(),
        "goodAt": "儿科内科，新生儿张发，儿科感冒，儿科腹泻，儿科肠胃炎，儿科骨科等等",
        "honorTitle": "荣誉头衔",
        "faceimage": tools.getAvater(),
        "sourceType": "二维码邀请",
        "articleNum": 1000,
        "postNum": 1000,
        "commentNum": 1000
      }
    }
  }, 
  {
    url: "/doctor/getInstorInfoById", //医生介绍信息
    method: "post",
    mockdata: {
      "status": 0,
      "message": "成功",
      "data": {
        "id": 1,
        "aiwen_id": tools.getDocId(),
        "name":tools.getName(),
        "departName": tools.getDocDepart(),
        "hospitalName": tools.getDocHospital(),
        "title": tools.getDocTitle(),
        "goodAt": "儿科内科，新生儿长发，儿科感冒,新生儿疾病的早期 诊断和干预，儿科内科，新生儿长发",
        "honorTitle": "亚洲医学美容协会激光美容分会副会长、 重庆市光学学会激光医学专委会副主任委员、重庆市美容皮肤科医疗质量控制中心主任、中国整形美容协会抗衰老分会理事、重庆市光学学理事、中国整形美容协会皮肤美容分会常委、中国整形美容协会激光美容分会常委、中国整形医师协会新材料新技术分会常委、 中国中西医结合学会医学美容专业委员会激光与皮肤美容专家委员常委、中华医学会皮肤性病学分会皮肤激光医疗美容组委员、中华医学会皮肤科专委会美容学分会委员、中华医学会医学美学与美容分会激光美容组委员、中国医师协会皮肤科医师分会激光亚专业委员会 委员、中国医师协会皮肤科医师分会激光亚专业委员会委员、中国整形美容协会医学美学文饰分会专家委员会委员、中国女医师协会皮肤性病专委会委员、 解放军激光专业委员会委员、重庆市医学会皮肤专委会委员、重庆市医学会激光专业委员会委员",
        "faceimage": tools.getAvater(),
        "introduction": "浙江省医学会儿科分会青年委员、围产分会青年委员、嘉兴市新世纪后备人才、嘉兴围产委员，发表论文十余篇，曾获嘉兴科技进步奖三等奖。擅长儿科疾病诊治，尤其擅长新生儿各类疾病的诊治。曾抢救成功嘉兴孕周最小体重也最小的早产儿。",
        "experience": {
          education: [{
            date: "2015-055005到2018-055002",
            text: "昆明大学本科",
          }],
          work: [{
            date: "2015-055005到2018-055002",
            text: "XX信息技术有限公司",
          }],
          awards: [{
            date: "2015-055005到2018-055002",
            text: "奖项",
          }],
          researchAchievements: [{
            date: "2015-055005到2018-055002",
            text: "科研成果",
          }],
          publishWorks: [{
            date: "2015-055005到2018-055002",
            text: "发表的作品1",
          }],
          personalHonor: [{
            id: 12,
            image: tools.getAvater(),
            name: "2011.11.01 中国医师协会皮肤科医师分会优秀中青年医师奖",
          }, {
            id: 13,
            image: tools.getAvater(),
            name: "2010.07.01 荣获院三等功一次",
          }]
        },
      }
    }
  },
  {
    url: "/doctor/getDynamicListById", //医生的动态列表
    method: "post",
    mockdata: {
      "status": 0,
      "message": "成功",
      "data": [
        {
          id: 1,
          dynamicId: 2,
          type: 2,
          title: "腰椎间盘突出怎么办？",
          desc: "发表了帖子",
          authorName: "张华",
          time: 1541229707,
        },
        {
          id: 2,
          dynamicId: 2,
          type: 2,
          title: "你会上厕所吗？上厕所的正确姿势在这里,大家点击看看厉不厉害",
          desc: "发表了帖子",
          authorName: "张华",
          time: 1541229707,
        }
      ]
    }
  },
  {
    url: "/doctor/getArticleListById", //医生的文章列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            "id": i,
            "articleId": tools.getDocId(),
            "title": "喝酒短片是不是病？",
            "coverimg": tools.getAvater(),
            "authorName": tools.getName(),
            "headPicUrl": tools.getAvater(),
            "helpNum": 15,
            tags: [{
              id: 1,
              name: "醉酒"
            }]
          };
          items.push(item);
        };
        return items;
      }
    )(),
  }, 
  {
    url: "/doctor/getPostListById", //医生的帖子列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            "id": i,
            "title": "你会上厕所吗？上厕所的正确姿势在这里！必须一起来讨论看看我说的对不对",
            "postId": tools.getDocId(),
            "comtyId": "11",
            "postionName": "首页贴吧位1",
            "faceimage": tools.getAvater(),
            "authorName": tools.getName(),
            "readNum": 10,
            "replyNum": 15,
            "publishTime": 1541209450,
            "tags": [{
              id: 1,
              name: "标签1"
            }],
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/doctor/getDepartList", //医生的科室列表
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": [
        {
          "id": "1",
          name: "儿科",
          children: [{
            id: 5,
            parentId: 1,
            name: "儿科1.1"
          }]
        },
        {
          "id": "2",
          name: "妇产科",
          children: [{
            id: 3,
            parentId: 1,
            name: "妇产科1.1"
          }]
        },
      ]
    }
  }
];
