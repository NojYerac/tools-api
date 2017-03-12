const crypto = require("crypto");

let tokens = [];

function checkToken(token) {
  // console.log(token);
  const now = Date.now();
  let valid = false;
  tokens = tokens.filter(t => {
    let _valid = (now - t.ts) < t.sessionExp;
    if (_valid && t._ === token._) {
      valid = token;
    }
    return _valid;
  });
  return valid;
}

function makeToken(t) {
  const token = Object.assign({}, t, {
    ts: Date.now(),
    _: crypto.randomBytes(32).toString("hex")
  });
  // console.log(token);
  tokens.push(token);
  return token;
}

module.exports = {
  authenticate: (creds, userModel) => {
    // console.log(creds);
    const username = creds.username || "",
      password = creds.password || "",
      startTime = Date.now(),
      delayTime = 1000; // 1 second
    return new Promise((resolve, reject) => {
      function delay(err, res) {
        const timeElapsed = Date.now() - startTime;
        const timeLeft = delayTime - timeElapsed;
        setTimeout(() => {
          if (err) {
            err.status = 401;
            return reject(err);
          }
          resolve(res);
        }, timeLeft);
      }
      // console.log(userModel);
      userModel.one({username}, (err, user) => {
        err = err || user ? null : new Error("Failed authentication");
        if (err) {
          return delay(err);
        }
        user.checkPassword(password, (err, passed) => {
          err = err || passed ? null : new Error("Failed authentication");
          if (err) {
            return delay(err);
          }
          const token = makeToken(user.token());
          delay(null, token);
        });
      });
    });
  },
  middleware: permission => (req, res, next) => {
    const token = checkToken(req.signedCookies.auth);
    const valid = !!token && (!permission || token.permission.indexOf(permission) > -1);
    if (!valid) {
      const err = new Error("Unauthorized");
      err.status = 403;
      return next(err);
    }
    req.user = token;
    next();
  },
  permissions: require("./permissions"),
  logout: token => {
    tokens = tokens.filter(t => t._ !== token._);
  }
};
