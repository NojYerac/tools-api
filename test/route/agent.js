const app = require("../../app");
const agent = require("supertest").agent(app);
module.exports.agent = agent;
module.exports.app = app;
