module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    node: true,
    browser: true,
    es6: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  //   extends: "standard",
  // required to lint *.vue files
  plugins: ['html'],
  parserOptions: {
    "sourceType": "module"
  },
  globals: {
    "$": true,
    "lib": true,

    "_hmt": true,
    "platformInfo": true,
    "wx": true,
    "utils": true
  },
  rules: {
    "comma-spacing": 0,
    // 强制在关键字前后使用一致的空格 (前后腰需要)
    "keyword-spacing": 0,
    // 禁止条件表达式中出现赋值操作符
    "no-cond-assign": 2,
    // 禁止在条件中使用常量表达式
    // if (false) {
    //     doSomethingUnfinished();
    // } //cuowu
    "no-constant-condition": 2,
    // 禁止 function 定义中出现重名参数
    "no-dupe-args": 2,
    // 禁止对象字面量中出现重复的 key
    "no-dupe-keys": 2,
    // 禁止重复的 case 标签
    "no-duplicate-case": 2,
    // 禁止空语句块
    "no-empty": 2,
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "linebreak-style": [
      0,
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": [2, {
      // 允许声明未使用变量
      // "vars": "local",
      // 参数不检查
      "args": "none"
    }],
  }
}
