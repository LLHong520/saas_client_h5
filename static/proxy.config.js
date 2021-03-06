var proxyConfig = {
  "test": {
    "api": "http://192.168.255.207:55099",//测试环境1
    "papi": "http://192.168.255.207:55098"
  },
  "test1": {
    "api": "http://192.168.255.221:55099",//测试环境2
    "papi": "http://192.168.255.207:55098"
  },
  "development": {
    // "api": "http://192.168.255.207:55099",
    // "papi": "http://192.168.255.207:55098"
    "api": "http://192.168.255.120:55099", // 开发
    "papi": "http://192.168.255.120:55098"
    // "api": "http://10.220.202.15:55099", // 双龙
    // "papi": "http://10.220.202.15:55098"
    // "api": "http://10.220.201.124:55099", // 尹斌
    // "papi": "http://10.220.201.124:55099"
    // "api": "http://10.220.200.235:55099", // 东阳
    // "papi": "http://10.220.200.235:55099"
    // "api": "http://10.220.202.31:55099", // 赵品
    // "papi": "http://10.220.202.31:55099"
  },
  "production": {
    "api": "http://h5-front.prod.wenwo.com",
    "papi": "http://postbar-front.prod.wenwo.com"
  }
};

module.exports = proxyConfig;
