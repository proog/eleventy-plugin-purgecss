const purge = require("./purge");

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on("afterBuild", () => purge(options));
};
