const agent = require("./agent").agent;
const app = require("./agent").app;


describe("The app", function() {
  before(done => {
    if (app.initilized) {return done();}
    app.init().then(() => done(), done);
  });

  it("should be testable", function() {
    (true).should.be.exactly(true);
  });

  it("should respond to HTTP requests", function(done) {
    agent.get("/status")
      .expect(200)
      .end((err, res) => {
        if (err) {return done(err);}
        res.text.should.be.exactly("OK");
        done();
      });
  });

  it("should apply CORS headers", function(done) {
    agent.options("/status")
      .set("Origin", "http://localhost:8000")
      .expect("Access-Control-Allow-Credentials", "true")
      .expect("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
      .expect("Access-Control-Allow-Origin", "http://localhost:8000")
      .expect(204, done);
  });

  it("should return a 404 response", function(done) {
    agent.get("/not-there")
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err);}
        res.text.should.match(/Not Found/);
        done();
      });
  });
});
