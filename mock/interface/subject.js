var tools = require("../tools.js");
module.exports = [
  {
    url: "/subject/queryListPaged", //专题分页列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            "id": i,
            "isTop": 0,
            "isRecommend": 1,
            "title": "女性健康知识",
            "coverUrl": tools.getAvater(),
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/subject/getInfoById", //某专题的详细信息
    method: "post",
    mockdata: {
      "isRecommend": 0,
      "publishTime": "2018-11-14 12:33:43",
      "createUserId": null,
      "updateUserId": null,
      "introduce": "这个是专题介绍",
      "classifyId": null,
      "orderNum": 0,
      "publishUserId": null,
      "departIds": ["string"],
      "updateTime": null,
      "title": "测试专题1",
      "orgId": "5bdbfe68c53caf34081d1eb8",
      "coverUrl": "https://wenwo-img-bucket-test.oss-cn-beijing.aliyuncs.com/fde965c9ab4cea95749c09191d70e503",
      "createTime": "2018-11-14 12:33:43",
      "isTop": 0,
      "sourcePlatform": "C_H5",
      "id": "5beba5a79bd1160008cddd57",
      "communityId": "5be3e18cd9a3a5846c9a35a0",
      "classifyName": null,
      "status": "1"
    }
  },
  {
    url: "/subject/getArticleListById", //专题的文章列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            "id": i,
            "articleId": tools.getDocId(),
            "title": "你会上厕所吗？上厕所的正确姿势在这里！",
            "coverimg": tools.getAvater(),
            "authorName": tools.getName(),
            "auhorId": tools.getDocId(),
            "userType": tools.getName(),
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
    url: "/subject/getRelativePosts", //获取当前专题相关帖子
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": [{
        "id": 1,
        "title": "你会上厕所吗？上厕所的正确姿势在这里！必须一起来讨论看看我说的对不对",
        "postId": "11",
        "communityId": "11",
        "postionName": "首页贴吧位1",
        "faceimage": "https://pic.wenwo.com/fimg/9326116135.jpg",
        "authorName": "李家杰妈妈",
        "readNum": 10,
        "replyNum": 15,
        "publishTime": 1541209450,
        "tags": [{
          id: 1,
          name: "标签1"
        }],
      }, {
        "id": 2,
        "title": "你会上厕所吗？上厕所的正确姿势在这里！",
        "postId": "12",
        "communityId": "12",
        "postionName": "首页贴吧位1",
        "faceimage": "https://pic.wenwo.com/fimg/9326116135.jpg",
        "authorName": "小油腻",
        "readNum": 10,
        "replyNum": 15,
        "publishTime": 1541209450,
        "tags": [{
          id: 1,
          name: "太聪明"
        }, {
          id: 2,
          name: "油炸小西米"
        }],
      }]
    }
  },
  {
    url: "/subject/getRelativeSubjects", //获取当前专题相关专题
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": [
        {
          "id": 566,
          "subjectId": 693,
          "title": "你会上厕所吗？",
          "coverUrl": "https://pic.wenwo.com/fimg/16555103710.jpg",
          "postionName": "首页贴吧位1"
        },
        {
          "id": 55,
          "subjectId": 888,
          "title": "头遍“洗茶水”到底要不要喝？这些饮茶禁忌您一…",
          "coverUrl": "https://pic.wenwo.com/fimg/7021027645.jpg",
          "postionName": "首页贴吧位1"
        }
      ]
    }
  }
];
