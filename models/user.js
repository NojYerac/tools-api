const crypto = require("crypto");

/**
 * [hashPassword description]
 * @param  {[type]}   password [description]
 * @param  {[type]}   salt     [description]
 * @param  {[type]}   rounds   [description]
 * @param  {[type]}   length   [description]
 * @param  {[type]}   digest   [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
function hashPassword(password, salt, rounds, length, digest, cb) {
  // console.log("hashPassword", password, salt, rounds, length, digest, cb);
  const s = (salt && new Buffer(salt)) || crypto.randomBytes(32).toString("hex");
  const r = parseInt(rounds) || 100000;
  const l = parseInt(length) || 512;
  const d = digest || "sha512";
  crypto.pbkdf2(password, s, r, l, d, (err, res) => {
    if (err) return cb(err);
    const key = res.toString("hex");
    cb(null, [s, r, l, d, key].join("$"));
  });
}

/**
 * [compare description]
 * @param  {[type]}   hashedPassword [description]
 * @param  {[type]}   password       [description]
 * @param  {Function} cb             [description]
 * @return {[type]}                  [description]
 */
function compare(hashedPassword, password, cb) {
  // console.log("compare", hashedPassword, password, cb);
  const parts = hashedPassword.split("$"),
    s = parts[0],
    r = parseInt(parts[1]),
    l = parseInt(parts[2]),
    d = parts[3],
    callback = (err, res) => {
      cb(err, res === hashedPassword);
    };
  hashPassword(password, s, r, l, d, callback);
}

/**
 * [validatePassword description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
function validatePassword(password) {
  // console.log("validatePassword", password);
  let valid = true;
  [
    /\d/,       // at least one digit,
    /[A-Z]/,    // a uppercase letter,
    /[a-z]/,    // a lowercase letter,
    /[^\w\s]/,  // and a symbol
    /.{8}/      // 8 chars minimum length
  ].forEach(re => {
    valid = valid && re.test(password);
  });
  return valid;
}

/**
 * [exports description]
 * @param  {[type]} db [description]
 * @return {[type]}    [description]
 */
module.exports = (db, models) => {
  models.user = db.define("user", {
    username: {
      type: "text",
      required: true,
      unique: true
    },
    password: {
      type: "text",
      required: true
    },
    session_exp: {
      type: "number",
      required: true,
      defaultValue: 24 * 60 * 60 * 1000 // 24 hours
    }
  }, {
    hooks: {
      beforeCreate: function(next) {
        // console.log("beforeCreate", this);
        let self = this;
        if (validatePassword(self.password)) {
          const cb = (err, hashedPassword) => {
            if (err) {return next(err);}
            self.password = hashedPassword;
            next();
          };
          hashPassword(self.password, null, null, null, null, cb);
        } else {
          next();
        }
      }
    },
    methods: {
      token: function() {
        return {
          id: this.id,
          username: this.username,
          sessionExp: this.session_exp,
          permission: this.permission.map(p => p.value)
        };
      },
      checkPassword: function(password, cb) {
        // console.log("checkPassword", this);
        return compare(this.password, password, cb);
      },
      setPassword: function(password, cb) {
        // console.log("setPassword", this);
        let self = this;
        if (!validatePassword(password)) {
          return cb(new Error("Invalid password"));
        }
        const callback = (err, res) => {
          if (err) {
            return cb(err);
          }
          self.hashedPassword = res;
        };
        hashPassword(password, callback);
      }
    }
  });

  models.user.hasMany("permission", models.permission, {}, {
    reverse: "users",
    key: true,
    autoFetch: true
  });
};
