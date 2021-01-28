export const port = 9001;

export const proxy = {
  "/saxi/": {
    target: `http://127.0.0.1:${port}`,
    pathRewrite: { "^/saxi/": "" },
  },
};

export const middleware = { path: "/saxi/", handler: saxiMiddleware };

function saxiMiddleware(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
}
export default { proxy, middleware, port };
