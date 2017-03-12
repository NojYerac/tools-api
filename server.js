/* eslint no-console: off */
const app = require("./app");
app.init().then(() => {
  const server = app.listen(app.config.port);
  server.on("listening", () => {
    console.log(`Server listening on port ${server.address().port}`);
  });
}).catch(err => {
  console.error(err);
});
