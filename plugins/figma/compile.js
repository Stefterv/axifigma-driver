import cloneDeep from "lodash/cloneDeep";
import webpack from "webpack";
import HtmlWebpackInlineSourcePlugin from "html-webpack-inline-source-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackBar from "webpackbar";
import NodeOutputFileSystem from "webpack/lib/node/NodeOutputFileSystem";

export default function(opt) {
  let nuxt = this.nuxt;
  this.nuxt.hook("webpack:config", async (builder) => {
    let buildDir = nuxt.options.buildDir + "/figma/";
    let options = cloneDeep(builder[1]);
    options.entry = {
      main: nuxt.resolver.resolvePath("~/plugins/figma/main.ts"),
      ui: nuxt.resolver.resolvePath("~/plugins/figma/ui.js"),
    };
    options.name = "figma";
    options.watch = true;
    options.output.filename = "[name].js";
    options.output.libraryTarget = "var";
    options.externals = [];
    delete options.target;

    options.plugins = options.plugins.filter(
      (plugin) => !(plugin instanceof WebpackBar)
    );
    let plugins = [
      new HtmlWebpackPlugin({
        template: nuxt.resolver.resolvePath("~/plugins/figma/ui.html"),
        filename: "ui.html",
        inlineSource: ".(js)$",
        chunks: ["ui"],
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new WebpackBar({
        name: "figma",
        color: "red",
      }),
    ];
    options.plugins.push(...plugins);

    options.output.path = buildDir;
    builder.push(options);
    if (!this.nuxt.options.dev) return;
    this.nuxt.hook("build:compile", async ({ name, compiler }) => {
      if (name != "figma") return;
      compiler.outputFileSystem = new NodeOutputFileSystem();
    });
  });
}
