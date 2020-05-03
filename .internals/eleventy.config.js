const rss = require("@11ty/eleventy-plugin-rss");
const htmlMinifier = require("html-minifier");
const dateFormat = require("date-fns/format");
const voca = require("voca");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const { src, dist } = require("./config");

module.exports = function (config) {
  config.addPlugin(rss);
  config.addPlugin(syntaxHighlight);
  config.addPassthroughCopy({ [`${src}/assets/images`]: "images" });
  config.addFilter("head", function (data, n) {
    return n < 0 ? data.slice(n) : data.slice(0, n);
  });
  config.addFilter("humanDate", function (date) {
    return dateFormat(date, "dd LLL yyyy");
  });
  config.addFilter("htmlDate", function (date) {
    return dateFormat(date, "yyyy-LL-dd");
  });
  config.addFilter("truncate", function (str, n) {
    return voca.truncate(str, n, "...");
  });
  config.addTransform("minify-html", function (content, outputPath) {
    if (!outputPath.endsWith(".html")) return content;

    return htmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    });
  });

  return {
    dir: {
      input: src,
      output: dist,
      includes: "includes",
      layouts: "includes/layouts",
    },
  };
};
