var Router = require("express").Router;
var route = module.exports = new Router();

route.use("/auth", require("./auth"));
route.use("/user", require("./user"));

route.get("/status", (req, res) => {
  res.send("OK");
});

route.use((req, res, next) => {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});

/* eslint-disable no-unused-vars, no-console */
route.use((error, req, res, next) => {
  res.status(error.status || 500);
  let e = {message: error.message};
  if (req.app.get("env") === "development") {
    console.error(error);
    e.stack = error.stack;
  }
  res.json(e);
});
