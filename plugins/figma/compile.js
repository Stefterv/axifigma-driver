import cloneDeep from "lodash/cloneDeep";
import webpack from "webpack";

const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

export default function() {
  let nuxt = this.nuxt;
  this.nuxt.hook("webpack:config", async (builder) => {
    let buildDir = nuxt.options.buildDir + "/figma/";
    let options = cloneDeep(builder[1]);
    options.entry = {
      main: nuxt.resolver.resolvePath("~/plugins/figma/main.ts"),
      ui: nuxt.resolver.resolvePath("~/plugins/figma/ui.ts"),
    };
    options.name = "figma";
    options.watch = true;
    options.output.filename = "[name].js";
    options.output.libraryTarget = "var";

    let plugins = [
      new HtmlWebpackPlugin({
        template: nuxt.resolver.resolvePath("~/plugins/figma/ui.html"),
        filename: "ui.html",
        inlineSource: ".(js)$",
        chunks: ["ui"],
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ];
    options.plugins.push(...plugins);

    options.output.path = buildDir;
    let runner = webpack(options);
    runner.watch(nuxt.options.watch, (err) => {});
  });
}
