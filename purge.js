const fs = require("fs");
const { promisify } = require("util");
const { PurgeCSS } = require("purgecss");

const fsWriteFile = promisify(fs.writeFile);

const defaultOptions = {
  config: "./purgecss.config.js",
  quiet: false,
};

module.exports = async function purge(options = {}) {
  function log(message, force = false) {
    if (force || !options.quiet) {
      console.log(`eleventy-plugin-purgecss: ${message}`);
    }
  }

  options = { ...defaultOptions, ...options };

  const startTime = Date.now();
  log(`Using configuration ${options.config}`);

  const result = await new PurgeCSS().purge(options.config);

  for (const { file, css, rejected, rejectedCss } of result) {
    log(`Writing ${file}`);
    if (rejected && rejected.length) {
      log(`Rejected: ${rejected.join(", ")}`);
    }
    if (rejectedCss) {
      log(`Rejected CSS: ${rejectedCss}`);
    }
    await fsWriteFile(file, css);
  }

  const durationInMs = (Date.now() - startTime).toFixed(1);
  log(`Finished purging ${result.length} file(s) in ${durationInMs}ms`, true);
};
