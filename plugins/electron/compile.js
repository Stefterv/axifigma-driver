import cloneDeep from "lodash/cloneDeep";
import webpack from "webpack";
import electron from "electron";
import proc from "child_process";
import WebpackBar from "webpackbar";
import NodeOutputFileSystem from "webpack/lib/node/NodeOutputFileSystem";

export default function() {
  let nuxt = this.nuxt;
  let electronProc = null;
  this.nuxt.hook("webpack:config", async (builder) => {
    let buildDir = nuxt.options.buildDir + "/electron/";
    let options = cloneDeep(builder[1]);
    options.entry = nuxt.resolver.resolvePath("~/plugins/electron/main.js");
    options.name = "electron";
    options.watch = true;
    options.output.filename = "main.js";

    options.output.path = buildDir;
    options.plugins = options.plugins.filter(
      (plugin) => !(plugin instanceof WebpackBar)
    );
    options.plugins.push(
      new WebpackBar({
        name: "electron",
        color: "cyan",
      })
    );
    builder.push(options);
    if (!this.nuxt.options.dev) return;
    this.nuxt.hook("build:compile", async ({ name, compiler }) => {
      if (name != "electron") return;
      compiler.outputFileSystem = new NodeOutputFileSystem();
    });
    this.nuxt.hook("build:compiled", async ({ name, compiler }) => {
      return;
      if (name != "electron") return;
      if (electronProc) {
        electronProc.kill("SIGINT");
      }
      const child = proc.spawn(
        electron,
        [nuxt.resolver.resolvePath("~/.nuxt/electron/main.js")],
        {}
      );

      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      const handleTerminationSignal = function(signal) {
        process.on(signal, function signalHandler() {
          if (!child.killed) {
            child.kill(signal);
          }
        });
      };
      electronProc = child;

      handleTerminationSignal("SIGINT");
      handleTerminationSignal("SIGTERM");
    });
  });
}
