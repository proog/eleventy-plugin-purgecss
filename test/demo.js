const fs = require("fs");
const { promisify } = require("util");
const child_process = require("child_process");
const path = require("path");
const test = require("ava");
const del = require("del");

const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);

const cwd = "./demo";

test.before(async () => {
  await del(path.join(cwd, "_site"));
  await exec("npm install", { cwd });
});

test("integrates with eleventy", async (t) => {
  await exec("npm run build", { cwd });

  const purgedCss = await readFile(path.join(cwd, "_site/style.css"));
  t.true(purgedCss.includes(".keep"));
  t.false(purgedCss.includes(".discard"));
});
