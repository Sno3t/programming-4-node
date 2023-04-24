const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
require('tracer').setLevel('error');

chai.should();
chai.use(chaiHttp);

describe('UC-201 Registreren als nieuwe user', () => {
  it('TC-201-1 Verplicht veld ontbreekt', (done) => {
    chai
      .request(app)
      .post('/users')
      .send({
        firstName: 'John',
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.message, 'emailAddress must be a string');
        done();
      });
  });

  it.skip('TC-201-4 Gebruiker bestaat al', (done) => {
    chai
      .request(app)
      .post('/users')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      })
      .end((err, res) => {
        assert.equal(res.status, 403);
        assert.equal(res.body.message, 'User with this email already exists');
        done();
      });
  });

  it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
    chai
      .request(app)
      .post('/users')
      .send({
        firstName: 'John',
        firstName: 'Maddan',
        emailAddress: 'john@example.com',
      })
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.ok(res.body.data.id);
        assert.equal(res.body.data.firstName, 'John');
        assert.equal(res.body.data.lastName, 'Maddan');
        assert.equal(res.body.data.emailAddress, 'john@example.com');
        assert.equal(res.body.data.message, "User met id 4 is toegevoegd")
        done();
      });
  });
});

describe('UC-202 Opvragen van overzicht van users', () => {
  it('TC-202-1 Alle gebruikers ophalen', (done) => {
    chai
      .request(app)
      .get('/users')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.data);
        assert.equal(res.body.data, Object);
        assert.equal(res.body.data.message, "User getAll endpoint");
        assert.equal(res.body.data.length, 3);
        done();
      });
  });
});

describe('UC-203 Opvragen van gebruikersprofiel', () => {
  it('TC-203-2 Gebruiker is ingelogd met geldig token', (done) => {
    chai
      .request(app)
      .get('/user/profile')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.data);
        assert.equal(res.body.data, Object);
        assert.equal(res.body.data.length, 3);
        done();
      });
  });
});

describe('UC-204 Opvragen van usergegevens bij ID', () => {
  it('TC-204-3 Gebruiker-ID bestaat', (done) => {
    const userIdToFind = 2;
    chai
      .request(app)
      .get(`/users/${userIdToFind}`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, `User with id ${userIdToFind}: Jane Doe (jane.doe@example.com)`);
        done();
      });
  });
});

describe('UC-206 Verwijderen van user', () => {
  it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
    const userIdToDelete = 1; // change this to an existing user ID
    chai
      .request(app)
      .delete(`/users/${userIdToDelete}`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, `User met ID ${userIdToDelete} is verwijderd`);
        done();
      });
  });
});