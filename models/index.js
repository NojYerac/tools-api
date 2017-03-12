const orm = require("orm");
module.exports = (options) => new Promise((resolve, reject) => {
  orm.connect(options, (err, db) => {
    if (err) {return reject(err);}
    let models = {};
    require("./permission")(db, models);
    require("./user")(db, models);
    db.sync(err => {
      if (err) {
        reject(err);
      }
      resolve(models);
    });
  });
});
