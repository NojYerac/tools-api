// const logger = require("morgan")("dev");
module.exports = (app) => {
  // app.use(logger);
  app.use((req, res, next) => next());
  return {
    port: 8000,
    cookieOpts: {
      secure: false,
      httpOnly: true,
      signed: true
    },
    appSecret: "SECRET",
    seedDb: true,
    dbOptions: {
      protocol: "sqlite",
      database: "radaf-test",
      filename: ":memory:"// path.resolve(__dirname, "..", "data/sqlite/data/radaf-test.sqlite"),
      // query: {debug: true}
    },
    corsOptions: {
      origins: ["http://localhost:8000"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      headers: ["X-Requested-With", "Content-Type"]
    }
  };
};
