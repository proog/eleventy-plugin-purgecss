const fs = require("fs");
const { promisify } = require("util");
const test = require("ava");
const purge = require("./purge");
const eleventyPlugin = require("./plugin");

const fsWriteFile = promisify(fs.writeFile);
const fsRm = promisify(fs.rm);

test.before(async () => {
  const contents = `module.exports = {
    content: ["./_site/**/*.html"],
    css: ["./_site/**/*.css"],
  };`;
  await fsWriteFile("./purgecss.config.js", contents);
  await fsWriteFile("./purgecss-custom.config.js", contents);
});

test.after(async () => {
  await fsRm("./purgecss.config.js");
  await fsRm("./purgecss-custom.config.js");
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
