const fs = require("fs");
const { promisify } = require("util");
const child_process = require("child_process");
const path = require("path");
const test = require("ava");
const { deleteAsync } = require("del");

const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);

for (const cwd of ["./demo", "./demo-v3"]) {
  test.before(async () => {
    await deleteAsync(path.join(cwd, "_site"));
    await exec("npm install", { cwd });
  });

  test(`integrates with eleventy (${cwd})`, async (t) => {
    await exec("npm run build", { cwd });

    const purgedCss = await readFile(path.join(cwd, "_site/style.css"));
    t.true(purgedCss.includes(".keep"));
    t.false(purgedCss.includes(".discard"));
  });
}
