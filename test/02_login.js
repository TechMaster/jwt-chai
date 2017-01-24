/**
 * Created by techmaster on 1/22/17.
 */
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();

let server = require('../index');
let token; //store token return from /login


describe("Login to get JWT token", () => {

  it("It should return 401 when get /secret without token", (done) => {
    chai.request(server)
      .get('/secret')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it("Login user name and password to get back token ", (done) => {
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({name: 'test', password: 'test'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('ok');
        //Lưu lại token cho lần truy cập sau
        sessionStorage.token = res.body.token;
        done();
      });
  });


  it("It should return 200 when get /secret wit token", (done) => {
    if (sessionStorage.token) {
      chai.request(server)
        .get('/secret')
        // .set('content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'JWT '.concat(sessionStorage.token))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('secret');
          done();
        });
    } else {
      throw new Error("JWT token does not exist");
    }

  });

});