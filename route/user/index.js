const Router = require("express").Router;
const route = module.exports = new Router();
const auth = require("../../auth");
const READ_USER = auth.permissions.READ_USER;
const CREATE_USER = auth.permissions.CREATE_USER;
const UPDATE_USER = auth.permissions.UPDATE_USER;
const DELETE_USER = auth.permissions.DELETE_USER;

route.get("/", auth.middleware(READ_USER), (req, res, next) => {
  let query = req.query;
  req.models.user.find(query, (err, users) => {
    if (err) {return next(err);}
    res.json(users.map(u => u.token()));
  });
});

route.get("/permission", auth.middleware(READ_USER), (req, res) => {
  res.json(auth.permissions);
});

route.get("/:id", auth.middleware(READ_USER), (req, res, next) => {
  req.models.user.get(req.params.id, (err, user) => {
    if (err) {return next(err);}
    res.json(user.token());
  });
});

route.post("/", auth.middleware(CREATE_USER), (req, res, next) => {
  const newUser = req.body;
  let permission = newUser.permission && [...newUser.permission] || [];
  req.models.permission.find({value: permission}, (err, p) => {
    if (err) {return next(err);}
    newUser.permission = p || [];
    // console.log(newUser);
    req.models.user.create(newUser, (err, user) => {
      if (err) {return next(err);}
      res.status(200).json(user.token());
    });
  });
});

route.delete("/:id", auth.middleware(DELETE_USER), (req, res, next) => {
  req.models.user.get(req.params.id, (err, user) => {
    if (err) {return next(err);}
    user.remove(err => {
      if (err) {return next(err);}
      res.status(204).send();
    });
  });
});

route.patch("/:id", auth.middleware(UPDATE_USER), (req, res, next) => {
  let changes = req.body;
  let permission = changes.permission && [...changes.permission];
  function updateUser() {
    req.models.user.get(req.params.id, (err, user) => {
      Object.keys(changes).forEach(k => {
        user[k] = changes[k];
      });
      user.save(err => {
        if (err) {return next(err);}
        res.json(user.token());
      });
    });
  }
  if (permission) {
    req.models.permission.find({value: permission}, (err, p) => {
      if (err) {return next(err);}
      changes.permission = p || [];
      updateUser();
    });
  } else {
    updateUser();
  }
});
