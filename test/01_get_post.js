/**
 * Created by techmaster on 1/22/17.
 */
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();

let server = require('../index');


describe("Simple get and post", () => {
  it("Get /", (done) => {
    chai.request(server)
      .get("/")
      .end((err, res) => {
        res.body.should.have.property('message');
        res.should.have.status(200);
        done();
      });
  });

  it("Post Test", (done) => {
    const data_sent_server = 'Rocker is good';
    chai.request(server)
      .post('/test')
      .set('content-type', 'application/x-www-form-urlencoded')  //See this http://stackoverflow.com/questions/35697763/post-request-via-chai
      .send({name: data_sent_server})
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.equal(data_sent_server);
        done();
      });
  });

});
