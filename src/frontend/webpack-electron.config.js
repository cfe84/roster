const config = require("./webpack.config");
config.target = "electron-renderer";
config.node = {
  "fs": true
};

console.log("Building for electron!")

module.exports = config;