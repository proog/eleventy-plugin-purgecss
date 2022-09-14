const pkg = require("./package.json");
const purge = require("./purge");

module.exports = function (eleventyConfig, options = {}) {
  try {
    eleventyConfig.versionCheck(pkg["11ty"].compatibility);
  } catch (e) {
    console.log(
      `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`
    );
  }

  eleventyConfig.on("afterBuild", () => purge(options));
};
