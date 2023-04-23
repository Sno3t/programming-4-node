const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

describe('UC-102 Informatie opvragen', function () {
  it('TC-102-1 - Server info should return succesful information', (done) => {
    chai
      .request(server)
      .get('/api/info')
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.has.property('status').to.be.equal(201);
        res.body.should.has.property('message');
        res.body.should.has.property('data');
        let { data, message } = res.body;
        data.should.be.an('object');
        data.should.has.property('studentName').to.be.equal('Davide');
        data.should.has.property('studentNumber').to.be.equal(1234567);
        done();
      });
  });

  it('TC-102-2 - Server should return valid error when endpoint does not exist', (done) => {
    chai
      .request(server)
      .get('/api/doesnotexist')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(404);
        message.should.be.a('string').that.is.equal('Endpoint not found');
        data.should.be.an('object');

        done();
      });
  });
});

const assert = require('assert')
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
chai.should();
chai.use(chaiHttp);

describe("Server-info", function() {
  it("Test Cae UC-102 Server-info", function(done) {
    chai
      .request(server)
      .get("/api/info")
      .end((err, res) => {
        res.body.should.be.an("object");
        res.body.should.has.property("status").to.be.equal(200);
        res.body.should.has.property("message");
        res.body.should.has.property("data");
        let { data, message } = res.body;
        data.should.be.an("object");
        data.should.has.property("studentName").to.be.equal("Tycho Brakenhoff");
        data.should.has.property("studentNumber").to.be.equal(2199294);
        done();
      });
  });

  it("TC-103 returns error on non-existent endpoint", function(done) {
    chai
      .request(server)
      .get("/api/doesnotexist")
      .end((err, res) => {
        // res.should.not.equal(undefined);
        // assert(err === null);
        //
        // let { data, message, status } = res.body;
        //
        // status.should.has.property("status").to.be.equal(404);
        //
        // message.should.be.an("object");
        // message.should.has.property("message").to.be.equal("Endpoint not found");
        // message.should.has.property("data");
        //
        // data.should.be.an("object");
        // data.should.has.property("data").has.to.be(null);
        // done();

        res.body.should.be.an("object");
        res.body.should.has.property("status").to.be.equal(404);
        res.body.should.has.property("message");
        res.body.should.has.property("data");
        let { data, message } = res.body;
        data.should.be.an("object");
        data.should.have.property("message").to.be.equal("Endpoint not found");
        data.should.has.property("data").to.be.equal(null);
        done();

      });
  });

});

