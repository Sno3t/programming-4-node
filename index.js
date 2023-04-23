const express = require('express');
const assert = require('assert');

const app = express();
const port = 3000;

// For access to application/json request body
app.use(express.json());

let database = {
  users: [
    {
      id: 0,
      firstName: 'Tycho',
      lastName: 'Brakenhoff',
      emailAdress: 'example@email.com'
      // Hier de overige velden uit het functioneel ontwerp
    }
  ]
};

// Ieder nieuw item in db krijgt 'autoincrement' index.
// Je moet die wel zelf toevoegen!
let index = database.users.length;

// Algemene route, vangt alle http-methods en alle URLs af, print
// een message, en ga naar de next URL (indien die matcht)!
app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});

// Info endpoints
app.get('/api/info', (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'Tycho',
      studentNumber: 12345,
      description: 'Welkom bij de server API van de share a meal.'
    }
  });
});

// UC-201 Registreren als nieuwe user
app.post('/api/register', (req, res) => {
  // De usergegevens zijn meegestuurd in de request body.
  // In de komende lessen gaan we testen of dat werkelijk zo is.
  const user = req.body;
  console.log('user = ', user);

  // Hier zie je hoe je binnenkomende user info kunt valideren.
  try {
    // assert(user === {}, 'Userinfo is missing');
    assert(typeof user.firstName === 'string', 'firstName must be a string');
    assert(
      typeof user.emailAdress === 'string',
      'emailAddress must be a string'
    );
  } catch (err) {
    // Als één van de asserts failt sturen we een error response.
    res.status(400).json({
      status: 400,
      message: err.message.toString(),
      data: {}
    });
    // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
    // wanneer er al een response is teruggestuurd.
    return;
  }

  // Zorg dat de id van de nieuwe user toegevoegd wordt
  // en hoog deze op voor de volgende insert.
  user.id = index++;
  // User toevoegen aan database
  database['users'].push(user);

  // Stuur het response terug
  res.status(200).json({
    status: 200,
    message: `User met id ${user.id} is toegevoegd`,
    // Wat je hier retourneert is een keuze; misschien wordt daar in het
    // ontwerpdocument iets over gezegd.
    data: user
  });
});

// UC-202 Opvragen van overzicht van users
app.get('/api/user', (req, res) => {
  // er moet precies 1 response verstuurd worden.
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    message: 'User getAll endpoint',
    data: database.users
  });
});

// Wanneer geen enkele endpoint matcht kom je hier terecht. Dit is dus
// een soort 'afvoerputje' (sink) voor niet-bestaande URLs in de server.
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {}
  });
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
