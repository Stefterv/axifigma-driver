import cloneDeep from "lodash/cloneDeep";
import webpack from "webpack";
import electron from "electron";
import proc from "child_process";

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
    let runner = webpack(options);
    runner.watch(nuxt.options.watch, (err) => {
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
