var userInterfaces = require("./interface/user.js");
var articleInterfaces = require("./interface/article.js");
var sysInterfaces = require("./interface/sys.js");
var homeInterfaces = require("./interface/home.js");
var subjectInterfaces = require("./interface/subject.js");
var doctorInterfaces = require("./interface/doctor.js");
var communityInterfaces = require("./interface/community.js");

//接口列表
var interfaces=[
  ...userInterfaces,
  ...articleInterfaces,
  ...sysInterfaces,
  ...homeInterfaces,
  ...subjectInterfaces,
  ...doctorInterfaces,
  ...communityInterfaces,
];

module.exports=interfaces;
