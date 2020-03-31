
const Koa = require("koa");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

const app = new Koa();
// const host = process.env.HOST || "127.0.0.1";
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 8082;

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(app.env === "production");

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(ctx => {
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset
    // console.log(ctx.url);
    // if (ctx.url == "/api/user/login") {
    //   async function login() {
    //     const {
    //       data
    //     } = await axiosServer.post("/login", req.body);
    //     return data;
    //   }
    //   login().then(function (data) {
    //     // 把token存储到cookie中
    //     const{ token } = data;
    //     if(token) {
    //       res.cookie( "token", token, { maxAge: 60000* 60* 24});

    //     } // 原封不动返回
    //     return res.json(data); }
    //   );
    // }
    return new Promise((resolve, reject) => {
      ctx.res.on("close", resolve);
      ctx.res.on("finish", resolve);
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        try {
          promise.then(resolve).catch(reject);
        } catch (e) {
          console.error("###error");
          console.log("requireURL：" + ctx.url);
          console.log(e);
        }
      });
    });
  });

  app.listen(port, host);
  console.log("===================@@@@@@@@@@@@@======================");
  consola.ready({
    message: `Server listening on http://${host}:${port}/c/`,
    badge: true
  });
}

start();
