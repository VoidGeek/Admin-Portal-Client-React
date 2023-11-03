const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://35.154.46.100:8080",
      changeOrigin: true,
    })
  );
};
