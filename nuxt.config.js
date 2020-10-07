const dev = process.env.NODE_ENV !== "production";
const saxi = dev ? ["~/plugins/saxi/server"] : [];

export default {
  buildModules: ["@nuxt/typescript-build"],
  modules: [
    "~/plugins/electron/compile",
    "~/plugins/figma/compile",
    ...saxi,
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
  typescript: {
    typeCheck: false,
  },
};
