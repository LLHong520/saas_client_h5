const pkg = require("./package");
const config = require("./static/proxy.config.js");
const logger = require("morgan");
const webpack = require("webpack");
// let proxyConfig = config.test;
console.log("nuxt-config=========");
console.log(process.env.NODE_ENV);
let proxyConfig = config[process.env.NODE_ENV];
let isProd = process.env.NODE_ENV === "production";
console.log(proxyConfig.api);
console.log("isProd");
console.log(isProd);
module.exports = {
  srcDir: "client/",
  serverMiddleware: [
    logger("dev", {
      skip: function (req, res) {
        //只输出接口请求的日志
        let reg = /^\/api/;
        let url = req.originalUrl;
        return !reg.test(url);
      }
    })
  ],
  /*
   ** Router config
   */
  router: {
    base: "/c/",
    middleware: ["sina_auto_login", "app_auto_login", "doc_comty_checklogin"],
    scrollBehavior: function (to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      };
    }
  },
  mode: "universal",
  render: {
    resourceHints: false
  },

  /*
   ** Headers of the page
   */
  head: {
    title: "爱问社区",
    script: [
      {
        src: "https://hm.baidu.com/hm.js?358a67abafe6a8d533b6b7d25bbc65ed"
      },
      //百度商桥
      // {
      //   src: "https://hm.baidu.com/hm.js?6b431558e704ea0dd9510a42df1feeb0"
      // },
      // {
      //   src: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js"
      // },
      // {
      //   src: "/c/js/jquery.min.js" // 注：c端域名有/c, 要带上，没有就要移除,,,服务器上无法引用到
      // },
      // {
      //   src: "/c/js/polyfill.min.js"
      // },
      {
        src: "https://api.map.baidu.com/api?v=2.0&ak=eYf9sA6yVTFHlh9ytU4a0EYY"
      },
      {
        src: "https://js.t.sinajs.cn/t4/enterprise/js/public/appframe/appClient.js"
      },
      // 获取ip地址
      {
        src: "https://pv.sohu.com/cityjson?ie=utf-8"
      },
      // 微信小程序js
      {
        src: "https://res.wx.qq.com/open/js/jweixin-1.4.0.js"
      },
    ],
    meta: [
      {
        charset: "utf-8",
      },
      // {
      //   "http-equiv": "Content-Security-Policy",
      //   content: isProd ? "upgrade-insecure-requests":""
      // },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no,minimum-scale=1,maximum-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: pkg.description
      },
      {
        name: "format-detection",
        content: "telephone=no",
      }
    ],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "/c/favicon.ico"
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: "~/components/loading.vue",
  loading: {
    color: "#00af4f",
    failedColor: "red"
  },

  /*
   ** Global CSS
   */
  css: [
    "~/assets/css/style.less",
    "~/assets/css/common.css",
    "~/static/css/base.css",
    "~/static/css/animate.css",
    "~/static/css/swiper-3.4.2.min.css",
    "video.js/dist/video-js.css"
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: "~/plugins/request.js",
      ssr: true
    },
    {
      src: "~/plugins/toast-inject.js",
      ssr: true
    },
    {
      src: "~/plugins/toast.js",
      ssr: false
    },
    {
      src: "~/plugins/platformInfo.js",
      ssr: false
    },
    {
      src: "~/plugins/router.js",
      ssr: true
    },
    {
      src: "~/static/js/polyfill.min.js",
      ssr: false
    },
    {
      src: "~/plugins/main.js",
      ssr: false
    },
    {
      src: "~/plugins/directiveGesture.js",
      ssr: false
    },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    "cookie-universal-nuxt",
    "@nuxtjs/axios",
    "@nuxtjs/proxy"
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    retry: {
      retries: 3
    }
  },
  proxy: {
    "/c/api": {
      pathRewrite: {
        "^/c/api": ""
      },
      target: proxyConfig.api,
    },
    "/c/papi": {
      pathRewrite: {
        "^/c/papi": ""
      },
      target: proxyConfig.papi,
    },
    "/mapi": {
      pathRewrite: {
        "^/mapi": ""
      },
      target: "http://127.0.0.1:8887"
    }
  },
  /*
   ** Build configuration
   */
  build: {
    analyza: {
      analyzeMode: "static"
    },
    postcss: {
      // 添加插件名称作为键，参数作为值
      // 使用npm或yarn安装它们
      preset: {
        // 更改postcss-preset-env 设置
        autoprefixer: {}
      }
    },
    // parallel:true,
    publicPath: "https://health.sina.cn/c/_nuxt/",
    presets: ["es2015", "stage-2"],
    babel: {
      // "presets": [
      //   ["env", {
      //     "modules": false,
      //     "targets": {
      //       "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      //     }
      //   }],
      //   "stage-2"
      // ],
      "plugins": [
        [
          "@babel/plugin-transform-modules-commonjs",
          {
            allowTopLevelThis: true,
          },
        ]
      ],
      // "env": {
      //   "test": {
      //     "presets": ["env", "stage-2"],
      //     "plugins": ["istanbul"]
      //   }
      // }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    },
    loaders: {
      imgUrl: {
        limit: 10000
      },
    },
    filenames: {
      img: ({isDev}) => isDev ? "[path][name].[ext]" : "img/[name].[hash:7].[ext]",
    },
    plugins: [
      new webpack.ProvidePlugin({
        "$": "jquery"
      })
    ]
  }
};
