const agent = require("./agent").agent;
const app = require("./agent").app;


describe("User route", function() {
  let userId;
  const userSpec = {
      username: "test1",
      password: "123456Aa!",
      permission: ["READ_USER"]
  };
  const userSpec2 = {
    username: "test2",
    permission: ["CREATE_USER", "DELETE_USER", "READ_USER", "UPDATE_USER"]
  };
  before(done => {
    if (app.initilized) {return done();}
    app.init().then(() => done(), done);
  });

  describe("POST /user", function() {
    it("should create users", done => {
      agent.post("/user")
        .set("content-type", "application/json")
        .send(userSpec)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.an.Object();
          res.body.username.should.be.eql("test1");
          if (err) {return done(err);}
          userId = res.body.id;
          done();
        });
    });
  });

  describe("GET /user", function() {
    it("should return a user", done => {
      agent.get("/user?username=test1")
        .expect(200)
        .end((err, res) => {
          if (err) {return done(err);}
          res.body.should.be.an.Array();
          res.body[0].username.should.eql("test1");
          done();
        });
    });
  });

  describe("GET /user/:id", function() {
    it("should return a user", done => {
      agent.get(`/user/${userId}`)
        .expect(200)
        .end((err, res) => {
          if (err) {return done(err);}
          res.body.should.be.an.Object();
          res.body.username.should.eql("test1");
          done();
        });
    });
  });

  describe("PATCH /user/:id", function() {
    it("should update users", done => {
      agent.patch(`/user/${userId}`)
        .set("content-type", "application/json")
        .send(userSpec2)
        .expect(200)
        .end((err, res) => {
          // console.log(res.body);
          if (err) {return done(err);}
          res.body.should.be.an.Object();
          res.body.username.should.eql("test2");
          res.body.permission.should.eql(userSpec2.permission);
          done();
        });
    });
  });

  describe("DELETE /user/:id", function() {
    it("should delete the user", done => {
      agent.delete(`/user/${userId}`)
        .expect(204)
        .end((err, res) => {
          res.body.should.be.empty();
          done(err);
        });
    });
  });
});
