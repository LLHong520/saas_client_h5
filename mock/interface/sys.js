var tools = require("../tools.js");
module.exports = [
  {
    url: "/message/queryList", //查询所有的文章分类
    method: "post",
    mockdata: {
      "status": 0,
      "message": "查询成功",
      "data": {
        "list": [{
          "id": 1,
          "title": "文章审核结果",
          "content": "文章审核结果",
          "publishTime": 1540296609496
        },
        {
          "id": 1,
          "title": "文章审核结果",
          "content": "文章审核结果",
          "publishTime": 1541209450,
        }],
        "page": 1,
        "rows": 10,
        "total": 0
      }
    }
  },
  {
    url: "/news/getNewsAndNotices",
    method: "get",
    mockdata:(
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            "id": i,
            title: "生命之花 | 记忆与爱同行，神经内科的" + i + 1,
            publishTime: 1541209450,
            coverUrl: tools.getAvater(),
          };
          items.push(item);
        };
        return items;
      }
    )()
  },
  {
    url: "/system/getNewsDeatilsById",//新闻公告详情
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": {
        "id": "1",
        title: "爱问快评-给高超医术点赞",
        publishTime: 1541209450,
        coverUrl: "药企",
        "content": "出生2周，体重2公斤，身长40厘米的新生儿芸芸，患有4种致命心脏疾病，华西医院心胸外科赁可医生采用深低温停循环选择性脑灌注的手术方式，体外循环机暂时替代了芸芸自身的心肺功能，26分钟内完成了主动脉弓重建成型手术，随后完成心内畸形修补，最终给了芸芸一个完整的心脏《你苦苦寻找的外科缝合图文及视频知不知道那么厉害》。<br/><br/><img src='" + tools.getAvater() + "'><p style='color:#999999;'>病人现场情况</p><br/>出生2周，体重2公斤，身长40厘米的新生儿芸芸，患有4种致命心脏疾病",
      }
    }
  }
];
