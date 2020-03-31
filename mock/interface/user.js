var tools = require("../tools.js");
module.exports = [
  {
    url: "/message/myMessageNum", //当前登录用户消息数目
    method: "get",
    mockdata: 10
  },
  {
    url: "/user/myInfo", //获取个人信息
    method: "get",
    mockdata: {
      "id": 1,
      "nickName": "狂奔的蜗牛",
      "gender": 2,
      "headPicUrl": tools.getAvater(),
      "phoneNum": "15611111111",
      "accountBinding": "微信号",
    }
  },
  {
    url: "/user/getUserDynamicList", //我的动态列表
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": {
        "list": [
          {
            id: 1,
            image: "https://pic.wenwo.com/fimg/54985142276.jpg",
            authorName: "放飞理想",
            desc: "评论了你的帖子",
            title: "什么是花甲？",
            time: 1541229707,
            type: 1,
            isReaded: 0,
          },
          {
            id: 1,
            image: "https://pic.wenwo.com/fimg/82298107520.jpg",
            authorName: "放飞理想",
            desc: "评论了你的帖子",
            title: "什么是花甲？",
            time: 1541229707,
            type: 1,
            isReaded: 0,
          },
        ],
        "page": 1,
        "size": 10,
        "total": 0
      }
    }
  },
  {
    url: "/message/getMyMessageList", //我的消息列表
    method: "get",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            id: i,
            image: tools.getAvater(),
            authorName: tools.getName(),
            desc: "评论了你的帖子",
            title: "什么是花甲？",
            time: 1541229707,
            type: 1,
            isReaded: 0,
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/user/checkNikename", //检测昵称是否存在
    method: "post",
    mockdata: {
      status: 200,
      data: null,
      message: "昵称可用"
    }
  },
  {
    url: "/user/sendCode", //注册发送验证码
    method: "post",
    mockdata: {
      status: 200,
      data: null,
      message: "发送成功"
    }
  },
  {
    url: "/api/user/regsiter", //用户注册
    method: "post",
    mockdata: {
      status: 200,
      data: null,
      message: "注册成功"
    }
  },
  {
    url: "/user/login", //用户登陆
    method: "post",
    mockdata: {
      token: "5bea3c6e0274390008b8c10a",
      isNewUser: 1,
      status: 1,
    }
  },
  {
    url: "/user/logOut", //用户退出登陆
    method: "post",
    mockdata: {
      status: 200,
      data: null,
      message: "操作成功"
    }
  },
  {
    url: "/user/bindMobile", //绑定手机号
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": null
    }
  },
  {
    url: "/user/getUserinfo", //获取个人信息
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": {
        "id": 1,
        "nikeName": tools.getName(),
        "gender": 1,
        "headPicUrl": tools.getAvater(),
        "phoneNum": "15611111111",
        "accountBinding": "微信号",
      }
    }
  },
  {
    url: "/user/updateMyinfo", //编辑个人信息
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": {
        "id": 1,
        "nickName": "狂奔的蜗牛",
        "gender": 2,
        "headPicUrl": "http://pic.wenwo.com/fimg/32992109129_750.jpg",
        "mobile": "手机号",
        "accountBinding": "微信号",
      }
    }
  },
  {
    url: "/user/getUserPostList", //获取用户的帖子列表
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 10; i++) {
          let item = {
            id: i,
            title: "什么是花甲？",
            time: 1541229707,
            readNum: tools.getDocId(),
            replyNum: tools.getDocId(),
            tags: [{
              id: 1,
              name: "标签名字"
            }],
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/user/setMessageReaded", //设置消息已读
    method: "post",
    mockdata: {
      "status": 200,
      "message": "成功",
      "data": null
    }
  },
  {
    url: "/system/uploadImg", //上传图片
    method: "post",
    mockdata: {
      "status": 200,
      "message": "上传成功",
      "data": {
        "imgId": "1211111121"
      }
    }
  },
];
