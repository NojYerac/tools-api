const agent = require("./agent").agent;
const app = require("./agent").app;

describe("Auth route", function() {
  before(done => {
    if (app.initilized) {return done();}
    app.init().then(() => done(), done);
  });

  it("should not allow access to authed routes", function(done) {
    agent.get("/auth")
      .expect(403)
      .end((err, res) => {
        res.body.message.should.eql("Unauthorized");
        done(err);
      });
  });

  it("should fail to authenticate", function(done) {
    this.timeout(1500);
    agent.post("/auth")
      .set("content-type", "application/json")
      .send({
        username: "testuser",
        password: "xxx"
      })
      .expect(401)
      .end((err, res) => {
        (res.headers["set-cookie"] === undefined).should.be.eql(true);
        done(err);
      });
  });

  it("should fail to authenticate", function(done) {
    this.timeout(1500);
    agent.post("/auth")
      .set({"content-type": "application/json"})
      .send(JSON.stringify({
        username: "xxx",
        password: "xxx"
      }))
      .expect(401)
      .end((err, res) => {
        (res.headers["set-cookie"] === undefined).should.be.eql(true);
        done(err);
      });
  });

  it("should authenticate", function(done) {
    this.timeout(1500);
    agent.post("/auth")
      .set({"content-type": "application/json"})
      .send(JSON.stringify({
        username: "testuser",
        password: "test-USER1"
      }))
      .expect(204)
      .end((err, res) => {
        res.headers["set-cookie"].should.match(/^auth=/);
        done(err);
      });
  });

  it("should allow access to authed routes", function(done) {
    agent.get("/auth")
      .expect(200)
      .end((err, res) => {
        res.body.should.be.instanceof(Object);
        res.body.username.should.be.eql("testuser");
        done(err);
      });
  });

  it("should log out", function(done) {
    agent.get("/auth?logout=true")
      .expect(204)
      .end((err) => {
        if (err) {return done(err);}
        agent.get("/auth")
          .expect(403, err => {
            if (err) {return done(err);}
            agent.post("/auth")
              .set({"content-type": "application/json"})
              .send(JSON.stringify({
                username: "testuser",
                password: "test-USER1"
              }))
              .expect(204, done);
          });
      });
  });

});
