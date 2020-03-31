var tools = require("../tools.js");
module.exports = [
  {
    url: "/homepage/getBannerPosSet", //首页banner设置
    method: "get",
    mockdata: [{
      "id": 1,
      "posId": "展示位id",
      "content": "展示位内容",
      "posDescribe": "展示位描述",
      "bannerType": 0,
      "url": "0",
      "businessType": 1,
      "businessId": 11,
      "bannerImages": tools.getAvater()
    },
    {
      "id": 2,
      "posId": "展示位id",
      "content": "展示位内容",
      "posDescribe": "展示位描述",
      "bannerType": 0,
      "url": "http://www.baidu.com",
      "businessType": 1,
      "businessId": 12,
      "bannerImages": tools.getAvater()
    }, {
      "id": 3,
      "posId": "展示位id",
      "content": "展示位内容",
      "posDescribe": "展示位描述",
      "bannerType": 0,
      "url": "0",
      "businessType": 1,
      "businessId": 13,
      "bannerImages": "http://pic.wenwo.com/fimg/8015062352_750.jpg"
    }, {
      "id": 4,
      "posId": "展示位id",
      "content": "展示位内容",
      "posDescribe": "展示位描述",
      "bannerType": 0,
      "url": "0",
      "businessType": 1,
      "businessId": 14,
      "bannerImages": tools.getAvater()
    }]

  },
  {
    url: "/homepage/getSubjectSet", //首页专题推荐位设置
    method: "post",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 2; i++) {
          let item = {
            "id": i,
            "subjectId": tools.getDocId(),
            "title": "你会上厕所吗？",
            "coverUrl": tools.getAvater(),
            "postionName": "首页贴吧位1"
          };
          items.push(item);
        };
        return items;
      }
    )(),
  },
  {
    url: "/homepage/getRecommendPosSet", //首页主功能推荐位设置
    method: "get",
    mockdata: [{
      "id": 1,
      "positionName": "展示位1",
      "displayType": 1,
      "displayName": "展示类型名1"
    },
    {
      "id": 2,
      "positionName": "展示位2",
      "displayType": 1,
      "displayName": "展示类型名2"
    }
    ]
  },
  {
    url: "/homepage/getDocPosSet", //首页医生推荐位设置
    method: "get",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 6; i++) {
          let item = {
            "id": i,
            "doctorName": tools.getName(),
            "faceimage": tools.getAvater(),
            "title": tools.getDocTitle(),
            "departName": tools.getDocDepart(),
            "hospitalName": tools.getDocHospital(),
            "goodAt": "医生擅长领域",
            "doctorId": tools.getDocId(),
            "postionName": "首页医生展示位" + i,
          };
          items.push(item);
        };
        return items;
      }
    )()
  },
  {
    url: "/homepage/getChannelSet", //首页推广渠道列表
    method: "get",
    mockdata: [{
      "id": 1,
      "qrCode": "11111111",
      "channelType": "微信客服",
      "channelName": "客服小无"
    },
    {
      "id": 2,
      "qrCode": "11111111",
      "channelType": "微博",
      "channelName": "XXX官方微博"
    }
    ]
  },
  {
    url: "/homepage/getArticleSet", //首页文章推荐位设置
    method: "post",
    mockdata: [{
      "id": 1,
      "articleId": tools.getDocId(),
      "title": "喝酒短片是不是病？",
      "coverimg": tools.getAvater(),
      "faceimage": tools.getAvater(),
      "authorName": tools.getName(),
      "helpNum": 15,
      "postionName": "首页文章1"
    },
    {
      "id": 2,
      "articleId": tools.getDocId(),
      "title": "喝酒短片是不是病？",
      "coverimg": tools.getAvater(),
      "faceimage": tools.getAvater(),
      "authorName": tools.getName(),
      "helpNum": 25,
      "postionName": "首页文章2"
    },
    {
      "id": 3,
      "articleId": tools.getDocId(),
      "title": "喝酒短片是不是病？",
      "coverimg": tools.getAvater(),
      "faceimage": tools.getAvater(),
      "authorName": "张华",
      "helpNum": 25,
      "postionName": "首页文章3"
    }
    ]
  },
  {
    url: "/homepage/getModuleSort", //首页模块排序
    method: "post",
    mockdata: [{
      "moduleType": "DOC_POSTION",
      "moduleName": "医生推荐位"
    },
    {
      "moduleType": "DOC_POSTION",
      "moduleName": "医生推荐位"
    }
    ]
  },
  {
    url: "/homepage/getPostbarSet", //首页贴吧设置
    method: "get",
    mockdata: (
      function () {
        let items = [];
        for (let i = 0; i < 6; i++) {
          let item = {
            "id": i,
            "title": "帖子名称",
            "postId": tools.getDocId(),
            "communityId": tools.getDocId(),
            "postionName": "首页贴吧位" + i,
            "faceimage": tools.getAvater(),
            "authorName": tools.getName(),
            "readNum": 10,
            "replyNum": 15,
            "tags": [{
              id: 1,
              name: "标签名称"
            }],
          };
          items.push(item);
        };
        return items;
      }
    )()
  },
];
