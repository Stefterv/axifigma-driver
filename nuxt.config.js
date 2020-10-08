export const nuxtPort = 9000;
export const saxiPort = 9001;

export default {
  nuxtPort,
  saxiPort,
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
    "/saxi/": {
      target: `http://127.0.0.1:${saxiPort}`,
      pathRewrite: { "^/saxi/": "" },
    },
  },
  typescript: {
    typeCheck: false,
  },
};
