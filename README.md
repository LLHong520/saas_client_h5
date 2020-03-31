# saas_client_h5

> 爱问saasC端项目

## Build Setup

``` bash
# 安装依赖
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# 生成个线上版本
$ npm run build

# 生成静态项目
$ npm run generate
```

#### SAAS C端H5上线步骤

1. 前端交付为一个文件目录,目录如下

```
  dist  
  --.nuxt  程序的主文件目录
  --static 程序运行所需静态资源文件目录（包含js、css、image等等）
  --nuxt.config.js 项目的配置文件
  --proxyConfig.json 代理配置文件
  --package.json 项目的依赖配置文件
```

2. 前端上线所需资源  

```
  a. C端应用层服务的接口域名（做配置代理，链接api）
      如：http://192.168.1.230:55099
  b. C端贴吧服务接口域名 （调用贴吧服务）
      如：http://192.168.1.231:55098
  c. C端微信第三方登录地址 （调用微信登录并回调）
      如：http://192.168.1.230:51003/auth/h5Login
```

3. 关于nginx配置需求  
  a.服务器需要开启 gzip压缩  
  b.服务器80端口指向dist目录  
  c.所有请求至该服务器的请求，若请求不到资源，则全部转发至 dist/index.html(配置示例如下)
  ```
  location / {
      root   dist;
      try_files $uri $uri/ /index.html =404;
  }
  ```

4. 线上部署说明

  a. 项目运行依赖node环境，线上环境需要安装node(v8.11.4及以上版本)
  b. 项目放至线上后，需要在此目录下运行来安装项目运行依赖

  ```
   //安装依赖
   npm i 
   //运行上线命令
   npm run server
  ```

  c.注意事项 

  > 关于代理
   /api 会被代理至 target 设置的域名（需要设置为C端应用层的服务部署域名）
   /papi 会被代理至 target 设置的域名（需要设置为C端社区服务的部署域名）

  ```
    proxy: {
      "/api": {
        pathRewrite: {
          "^/api": ""
        },
        target: "http://192.168.1.230:55099",//测试
      },
      "/papi": {
        pathRewrite: {
          "^/papi": ""
        },
        target: "http://192.168.1.231:55098",//测试环境
      },
    },
  ```

  > 关于项目启动的端口

  当在项目目录下运行```npm run server```命令，服务会默认监听 ```56000``` 端口
  若要更改端口，请修改项目下 package.json 中的 

  ```
  "release": "PORT=56000 nuxt start",
  ```

  完整配置如下

  ```
  ...
  "private": true,
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon server/index.js --watch server",
    "build": "nuxt build",
    "start": "cross-env NODE_ENV=production node server/index.js",
    "release": "PORT=56000 nuxt start",
    "server": "pm2 start npm --name 'saas-client' -- run release --watch",
    "generate": "nuxt generate",
    "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
    "precommit": "npm run lint",
    "mock": "pm2 start  mock/server.js --watch",
    "mock:stop": "pm2 stop mock/server.js"
  },
  "dependencies": {
  ...
  ```
  

## 开发相关

  开发环境可使用的社区id为
  ``` 
  5c0489e68a1e0e0008118bf1
  ```
  医院推荐链接（或者药店地图）
  ```
  http://127.0.0.1:8082/c/find/hospital?comtyId=5c0489e68a1e0e0008118bf1
  ```

  首页链接

  ```
  http://127.0.0.1:8082/c?comtyId=5c0489e68a1e0e0008118bf1
  ```

