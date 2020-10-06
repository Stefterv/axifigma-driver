export default {
  buildModules: ["@nuxt/typescript-build"],
  modules: [
    "~/plugins/electron/compile",
    "~/plugins/figma/compile",
    "~/plugins/saxi/server",
    "@nuxtjs/axios",
  ],
  plugins: [{ src: "~/plugins/saxi/driver", ssr: true }],
  axios: {
    proxy: true,
  },
  proxy: {
    "/saxi/": {
      target: "http://127.0.0.1:9090",
      pathRewrite: { "^/saxi/": "" },
    },
  },
};
