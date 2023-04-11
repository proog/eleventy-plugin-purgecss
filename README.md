# eleventy-plugin-purgecss

[![npm](https://img.shields.io/npm/v/eleventy-plugin-purgecss?style=for-the-badge)](https://www.npmjs.com/package/eleventy-plugin-purgecss)
[![npm](https://img.shields.io/npm/dw/eleventy-plugin-purgecss?style=for-the-badge)](https://www.npmjs.com/package/eleventy-plugin-purgecss)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/proog/eleventy-plugin-purgecss/npm-test.yml?branch=main&style=for-the-badge)](https://github.com/proog/eleventy-plugin-purgecss/actions/workflows/npm-test.yml)

Eleventy plugin that runs [PurgeCSS](https://purgecss.com/) after each build. PurgeCSS makes stylesheets smaller by inspecting the content they are used in, then discarding any CSS that is not referenced.

Inspired by the lovely [jekyll-purgecss](https://github.com/mhanberg/jekyll-purgecss).

## Installation

```sh
npm install --save eleventy-plugin-purgecss
```

Requires Eleventy 0.11.1 or higher.

## Usage

This plugin executes PurgeCSS every time Eleventy builds your site and is designed to purge output CSS files in-place.

First, make sure you have a [PurgeCSS configuration file](https://purgecss.com/configuration.html), probably in the root of your project. Here is an example:

```js
// purgecss.config.js

module.exports = {
  // Content files referencing CSS classes
  content: ["./_site/**/*.html"],

  // CSS files to be purged in-place
  css: ["./_site/**/*.css"],
};
```

Then register the plugin in `.eleventy.js`. By default, the plugin uses configuration from `./purgecss.config.js`, but a different configuration file can be specified when registering the plugin.

```js
// .eleventy.js

const purgeCssPlugin = require("eleventy-plugin-purgecss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(purgeCssPlugin, {
    // Optional: Specify the location of your PurgeCSS config
    config: "./purgecss.config.js",

    // Optional: Set quiet: true to suppress terminal output
    quiet: false,
  });
};
```

The CSS files specified in the configuration are now purged in-place every time the site is built.

### Run only in production

Since purging CSS can take some time for larger sites, it may be beneficial to only enable this plugin when building for production. One way to do this is to wrap the plugin registration in a condition, like so:

```js
if (process.env.NODE_ENV === "production") {
  eleventyConfig.addPlugin(purgeCssPlugin);
}
```

You can then enable the plugin by setting the `NODE_ENV` environment variable to "production". Environment variables can be configured graphically on platforms like [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), and others. When building manually, the following command can be used in most shells:

```sh
NODE_ENV=production eleventy # or whatever your build command is
```

### Troubleshooting

It can be useful to check that PurgeCSS removes the CSS you expect. If you enable the `rejected` or `rejectedCss` options in your PurgeCSS configuration, the plugin will output the purged CSS to the terminal (unless the plugin is set to `quiet`).

## Known issues

Pre-1.0 versions of Eleventy [do not wait for asynchronous event hooks](https://github.com/11ty/11ty-website/pull/562#issuecomment-647008047) before reloading the browser in `--serve` mode, which affects this plugin. This is not a problem when performing a regular build, but causes issues in `--serve` mode as Eleventy may reload the browser before the plugin has finished processing the files.

This [was fixed in Eleventy 1.0](https://www.11ty.dev/docs/events/), but if you're working with an older version, you might need to manually reload the page once the plugin reports "finished" to get the purged CSS.
