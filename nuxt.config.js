import Saxi from "./plugins/saxi/config"
export const nuxtPort = 9000;
export const saxiPort = Saxi.port;


export default {
  nuxtPort,
  saxiPort: Saxi.port,
  server: {
    port: nuxtPort,
  },
  buildModules: ["@nuxt/typescript-build"],
  modules: [
    "~/plugins/electron/compile",
    "~/plugins/figma/compile",
    "@nuxtjs/axios",
    "@nuxtjs/sitemap",
    "cookie-universal-nuxt",
  ],
  axios: {
    proxy: true,
  },
  proxy: {
    ...Saxi.proxy
  },
  serverMiddleware: [Saxi.middleware],
  typescript: {
    typeCheck: false,
  },
};

