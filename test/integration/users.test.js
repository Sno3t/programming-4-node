const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

describe('UC-201 Registreren als nieuwe user', () => {
  it('TC-201-1 - Verplicht veld ontbreekt', (done) => {
    // Testen die te maken hebben met authenticatie of het valideren van
    // verplichte velden kun je nog niet uitvoeren. Voor het eerste inlevermoment
    // mag je die overslaan.
    // In een volgende huiswerk opdracht ga je deze tests wel uitwerken.
    // Voor nu:
    done();
  });

  it('TC-201-5 - User succesvol geregistreerd', (done) => {
    // nieuwe user waarmee we testen
    const newUser = {
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl'
    };

    // Voer de test uit
    chai
      .request(server)
      .post('/api/register')
      .send(newUser)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').that.contains('toegevoegd');
        data.should.be.an('object');

        // OPDRACHT!
        // Bekijk zelf de API reference op https://www.chaijs.com/api/bdd/
        // Daar zie je welke chained functions je nog meer kunt gebruiken.
        data.should.include({ id: 2 });
        data.should.not.include({ id: 0 });
        data.id.should.equal(2);
        data.firstName.should.equal('Hendrik');

        done();
      });
  });
});

describe('UC-202 Opvragen van overzicht van users', () => {
  it('TC-202-1 - Toon alle gebruikers, minimaal 2', (done) => {
    // Voer de test uit
    chai
      .request(server)
      .get('/api/user')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getAll endpoint');

        // Je kunt hier nog testen dat er werkelijk 2 userobjecten in het array zitten.
        // Maarrr: omdat we in een eerder test een user hebben toegevoegd, bevat
        // de database nu 3 users...
        // We komen hier nog op terug.
        data.should.be.an('array').that.has.length(3);

        done();
      });
  });

  // Je kunt een test ook tijdelijk skippen om je te focussen op andere testcases.
  // Dan gebruik je it.skip
  it.skip('TC-202-2 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
    // Voer de test uit
    chai
      .request(server)
      .get('/api/user')
      .query({ name: 'foo', city: 'non-existent' })
      // Is gelijk aan .get('/api/user?name=foo&city=non-existent')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getAll endpoint');
        data.should.be.an('array');

        done();
      });
  });
});
