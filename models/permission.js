/**
 * [exports description]
 * @param  {[type]} db [description]
 * @return {[type]}    [description]
 */
module.exports = (db, models) => {
  models.permission = db.define("permission", {
    value: {
      type: "text",
      required: true,
      unique: true
    }
  });
};
