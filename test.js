const fs = require("fs/promises");
const test = require("ava");
const purge = require("./purge");
const eleventyPlugin = require("./plugin");

test.before(async () => {
  const contents = `module.exports = {
    content: ["./_site/**/*.html"],
    css: ["./_site/**/*.css"],
  };`;
  await fs.writeFile("./purgecss.config.js", contents);
  await fs.writeFile("./purgecss-custom.config.js", contents);
});

test.after(async () => {
  await fs.rm("./purgecss.config.js");
  await fs.rm("./purgecss-custom.config.js");
});

test("does not throw with default config", async (t) => {
  await t.notThrowsAsync(purge());
});

test("does not throw with custom config", async (t) => {
  await t.notThrowsAsync(
    purge({
      config: "./purgecss-custom.config.js",
    })
  );
});

test("throws when config does not exist", async (t) => {
  await t.throwsAsync(
    purge({
      config: "./purgecss-notfound.config.js",
    })
  );
});

test("eleventy plugin registers afterBuild hook", async (t) => {
  t.plan(2);

  const mockEleventyConfig = {
    on(eventName, fn) {
      t.is(eventName, "afterBuild");
      t.true(typeof fn === "function");
    },
  };

  eleventyPlugin(mockEleventyConfig);
});
