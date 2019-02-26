var path = require("path");

module.exports = {
  root: path.resolve(__dirname, "../src"), // 需要启动的路径
  route: require("./weibo.route"), // 对应的后端api路由
  index: "index.html"
};
