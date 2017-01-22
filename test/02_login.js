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

  it("Login user name and password to get back token ", (done) => {
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({name: 'test', password: 'test'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('ok');
        token = res.body.token;
        console.log(token);  //In ra token trả về
        done();
      });
  });


  it("Try to get secret data at /secret", () => {
    chai.request(server)
      .get('/secret')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'JWT '.concat(token))
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('secret');
        console.log(res.body.data);
        done();
      });

  });

});