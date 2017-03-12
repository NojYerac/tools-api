const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const models = require("../models");
const seedDb = require("../models/seed");
const corsHeaders = opts => {
  // console.log("creating middleware", opts);
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": opts.methods.join(", "),
    "Access-Control-Allow-Headers": opts.headers.join(", ")
  };
  return (req, res, next) => {
    const origin = req.headers.origin ?
      req.headers.origin.toLowerCase() :
      null;
    if (origin && opts.origins.indexOf(origin) > -1) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set(headers);
      if (req.method === "OPTIONS") {
        return res.status(204).send();
      }
    }
    next();
  };
};
module.exports = (app) => {
  const env = validateEnv(process.env.NODE_ENV);
  app.config = {};
  const config = Object.assign(app.config, {/*****/}, require(`./${env}`)(app));
  const initilization = [
    models(config.dbOptions)
      .then(m => {
        if (config.seedDb) {
          return seedDb(m).then(() => m);
        }
        return Promise.resolve(m);
      })
      .then(m => {
        app.models = m;
      })
  ];

  app.init = () => Promise.all(initilization).then(() => {app.initilized = true;});
  app.set("env", env);
  app.use(
    (req, res, next) => {
      req.config = config;
      req.models = app.models;
      next();
    },
    favicon(path.resolve(__dirname, "..", "public/images/favicon.ico")),
    corsHeaders(config.corsOptions),
    cookieParser(config.appSecret),
    bodyParser.json(),
    require("../route")
  );
  return config;
};

function validateEnv(env) {
  if (/prod/i.test(env)) return "production";
  if (/test/i.test(env)) return "test";
  return "development";
}
