var tools = require("../tools.js");
module.exports = [
  {
    url: "/article/queryAllArticleTypes", //查询所有的文章分类
    method: "post",
    mockdata: {
      "status": 200,
      "message": "查询成功",
      "data": [{
        "id": 1,
        "name": "女性健康"
      },{
        "id": 2,
        "name": "男性健康"
      }, {
        "id": 3,
        "name": "孕产课堂"
      }, {
        "id": 4,
        "name": "育儿指南"
      }, {
        "id": 5,
        "name": "心理健康"
      }, {
        "id": 6,
        "name": "整形美容"
      }, {
        "id": 7,
        "name": "营养保健"
      }, {
        "id": 8,
        "name": "中医养生"
      }]
    }
  },
  {
    url: "/article/saveAction", //文章点赞、取消点赞，点水、取消点水
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": null
    }
  },
  {
    url: "/article/queryListPaged", //查询文章分页列表
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
            "imgs": [],
            "authorName": tools.getName(),
            "auhorId": tools.getDocId(),
            "userType": "NORMAL_P",
            "headPicUrl": tools.getAvater(),
            "helpNum": 48,
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/article/getInfoById", //查询某文章的详细信息
    method: "post",
    mockdata: {
      "status": 200,
      "message": "查询成功",
      "data": {
        "id": 1,
        "articleId": 11,
        "title": "喝酒短片是不是病？",
        "coverimg": "微信客服",
        "authorName": tools.getName(),
        "helpNum": 15,
        "publishTime": 1541129970,
        "content": "出生2周，体重2公斤，身长40厘米的新生儿芸芸，患有4种致命心脏疾病，华西医院心胸外科赁可医生采用深低温停循环选择性脑灌注的手术方式，体外循环机暂时替代了芸芸自身的心肺功能，26分钟内完成了主动脉弓重建成型手术，随后完成心内畸形修补，最终给了芸芸一个完整的心脏《你苦苦寻找的外科缝合图文及视频知不知道那么厉害》。<br/><br/><img src='" + tools.getAvater() + "'><p style='color:#999999;'>病人现场情况</p><br/>出生2周，体重2公斤，身长40厘米的新生儿芸芸，患有4种致命心脏疾病",
        "tags": [{
          id: 1,
          name: "标签1",
        },{
          id: 2,
          name: "标签2",
        }],
        "authorInfo": {
          auhorId: tools.rand(1, 23),
          name: tools.getName(),
          departName: "男科",
          hospitalName: "深圳市南山医院",
          title:"主任医师",
          faceimage: tools.getAvater(),
          goodAt: "儿科内科，新生儿张发，儿科感冒，儿科腹泻，儿科肠胃炎，儿科骨科等等"
        },
        "subjectList":[{
          id:1,
          subjectName: "宝宝感冒后不留鼻涕仍鼻塞， 是不是鼻炎？",
          coverImg: tools.getAvater(),
        }]
      }
    }
  },
  {
    url: "/article/getArticleListById", //相关文章列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 3; i++) {
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
    url: "/article/getRelativePosts", //获取当前文章相关帖子
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
        "authorName": tools.getName(),
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
        "authorName": tools.getName(),
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
  }
];
