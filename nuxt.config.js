import Saxi from "./plugins/saxi/config";
export const nuxtPort = 9000;
export const saxiPort = Saxi.port;

export default {
  nuxtPort,
  saxiPort: Saxi.port,
  server: {
    host: "0.0.0.0",
    port: nuxtPort,
  },
  css: ["~/style/global.scss"],
  buildModules: ["@nuxt/typescript-build"],
  build: {
    extend(config, { isDev, isClient }) {
      if (!isClient) return;
      config.node = {
        fs: "empty",
        child_process: "empty",
      };
    },
  },
  modules: [
    "~/plugins/electron/compile",
    "~/plugins/figma/compile",
    "~/modules/axidraw/api",

    "@nuxtjs/axios",
    "@nuxtjs/sitemap",
    "cookie-universal-nuxt",
  ],
  axios: {
    proxy: true,
  },
  plugins: ["~/plugins/filters", "~/plugins/globals"],
  proxy: {
    // ...Saxi.proxy,
  },
  serverMiddleware: [Saxi.middleware],
  typescript: {
    typeCheck: false,
  },
};
