const logger = require("morgan")("dev");
module.exports = (app) => {
  app.use(logger);
  return {
    port: 8001,
    cookieOpts: {
      secure: false,
      httpOnly: true,
      signed: true
    },
    appSecret: "SECRET",
    seedDb: true,
    dbOptions: {
      protocol: "postgres",
      user:     "radaf-dev",
      password: "radaf-dev",
      host:     "localhost",
      port:     "5432",
      database: "radaf-dev",
      query: {
        debug: true
      }
    },
    corsOptions: {
      origins: ["http://localhost:8000"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      headers: ["X-Requested-With", "Content-Type"]
    }
  };
};
