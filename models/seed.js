const permissions = require("../auth/permissions");

module.exports = models => new Promise((resolve, reject) => {
  models.permission.clear(err => {
    if (err) {
      return reject(err);
    }
    const types = [];
    for (let k in permissions) {
      types.push({value: permissions[k]});
    }
    models.permission.create(types, (err, perms) => {
      // console.log(permissions);
      if (err) {
        return reject(err);
      }
      models.user.clear(err => {
        if (err) {
          return reject(err);
        }
        models.user.create({
          username: "testuser",
          password: "test-USER1",
          permission: perms
        }, err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  });
});
