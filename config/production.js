module.exports = (app) => {
  app.use((req, res, next) => next());
  return {
    port: process.env.PORT || 8000,
    cookieOpts: {
      secure: true,
      httpOnly: true,
      signed: true
    },
    appSecret: process.env.SECRET,
    dbOptions: {
      protocol: "postgres",
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    corsOptions: {
      origins: process.env.CORS_ALLOWED_ORIGINS.split(","),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      headers: ["X-Requested-With", "Content-Type"]
    }
  };
};
