import purgeCssPlugin from "eleventy-plugin-purgecss";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPlugin(purgeCssPlugin, {
    quiet: true,
    config: "./purgecss.config.cjs",
  });
}
