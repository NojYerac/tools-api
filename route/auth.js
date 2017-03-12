var Router = require("express").Router;
var route = module.exports = new Router();
var auth = require("../auth");

route.post("/", (req, res, next) => {
  auth.authenticate(req.body, req.models.user)
    .then(token => {
      const cookieOpts = req.config.cookieOpts;
      res.cookie("auth", token, cookieOpts);
      res.status(204).send();
    })
    .catch(next);
});

route.get("/", auth.middleware(), (req, res) => {
  let token = Object.assign({}, req.user);
  if (req.query.logout) {
    auth.logout(token);
    const cookieOpts = Object.assign({}, req.config.cookieOpts, {
      maxAge: 0,
      expires: new Date()
    });
    res.cookie("auth", "xxx", cookieOpts);
    return res.status(204).send();
  }
  delete token._;
  res.json(token);
});
