const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");

chai.should();
chai.use(chaiHttp);

describe("UC-201 Registreren als nieuwe user", () => {
  it("TC-201-1 - Verplicht veld ontbreekt", (done) => {
    // Testen die te maken hebben met authenticatie of het valideren van
    // verplichte velden kun je nog niet uitvoeren. Voor het eerste inlevermoment
    // mag je die overslaan.
    // In een volgende huiswerk opdracht ga je deze tests wel uitwerken.
    // Voor nu:
    done();
  });
//
  it("TC-201-5 - User succesvol geregistreerd", (done) => {
    const newUser = {
      firstName: "Hendrik",
      lastName: "van Dam",
      emailAdress: "hvd@server.nl"
    };

    chai
      .request(server)
      .post("/api/register")
      .send(newUser)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an("object");
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a("string").that.contains("toegevoegd");
        data.should.be.an("object");

        data.should.include({ id: 2 });
        data.should.not.include({ id: 0 });
        data.id.should.equal(2);
        data.firstName.should.equal("Hendrik");

        done();
      });
  });
});


describe("UC-202 Opvragen van overzicht van users", () => {
  it("TC-202-1 - Toon alle gebruikers, minimaal 2", (done) => {
    // Voer de test uit
    chai
      .request(server)
      .get("/api/user")
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an("object");
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a("string").equal("User getAll endpoint");

        data.should.be.an("array").that.has.length(3);

        done();
      });
  });
//
//   it.skip('TC-202-2 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
//     // Voer de test uit
//     chai
//       .request(server)
//       .get('/api/user')
//       .query({ name: 'foo', city: 'non-existent' })
//       // Is gelijk aan .get('/api/user?name=foo&city=non-existent')
//       .end((err, res) => {
//         assert(err === null);
//
//         res.body.should.be.an('object');
//         let { data, message, status } = res.body;
//
//         status.should.equal(200);
//         message.should.be.a('string').equal('User getAll endpoint');
//         data.should.be.an('array');
//
//         done();
//       });
//   });
});

describe("UC-206 Verwijderen van user", () => {
  it("TC-206-4 - Gebruiker succesvol verwijderd", (done) => {
    // Voer de test uit
    chai
      .request(server)
      .get("/api/user")
      .end((err, res) => {
        assert(err === null);
        let { data, message, status } = res.body;
        status.should.equal(200);
        message.should.be.a("string").equal("User met ID 1 is verwijderd");

        done();
      });
  });
});
