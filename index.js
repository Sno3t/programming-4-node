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
        message: 'User profile ',
        data: database.users
    });
});

// UC-203 Opvragen van overzicht van users met filter
app.get('/api/user', (req, res) => {
    const statusCode = 200;

    const filters = req.query;
    let filteredUsers = users;

    // Apply filters to the list of users
    if (filters.studentName) {
        filteredUsers = filteredUsers.filter(user => user.studentName.toLowerCase().includes(filters.studentName.toLowerCase()));
    }
    if (filters.studentNumber) {
        filteredUsers = filteredUsers.filter(user => user.studentNumber.toLowerCase().includes(filters.studentNumber.toLowerCase()));
    }
    if (filters.emailAdress) {
        filteredUsers = filteredUsers.filter(user => user.emailAdress.toLowerCase().includes(filters.emailAdress.toLowerCase()));
    }

    res.status(statusCode).json({
        status: statusCode,
        message: 'User profile ',
        data: filteredUsers
    });
});


// UC-204  Opvragen van

gebruikersprofiel
app.get('/api/user/profile', (req, res) => {
    // Usergegevens en userId 
    const statusCode = 200;
    res.status(statusCode).json({
        status: statusCode,
        message: 'Get all user profiles',
        data: database.users
    });
});

// UC-205 Opvragen van usergegevens bij ID
app.get('/api/user/:userId ', (req, res) => {
    // Usergegevens en userId 
    const userIdToFind = parseInt(req.params.userId);

    database.users.forEach(function (user) {
        if (user.id === userIdToFind) {
            const statusCode = 200;
            message = `User with id ${userIdToFind}: ${user.firstName} ${user.lastName} (${user.emailAdress})`;
        } else {
            statusCode = 404;
            message = `User with ${userIdToFind} ID has not been found`;
        }
    });

    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: database.users
    });
});


// UC-206 Wijzigen van usergegevens 
app.put('/api/user/:userId', (req, res) => {
    let statusCode = 200;
    const userId = parseInt(req.params.userId);
    const { name, email } = req.body;
    const userToUpdate = users.find(user => user.id === userId);

    // If the user is not found, send a 404 error response
    if (!userToUpdate) {
        statusCode = 404;
        message = `User with ${userId} ID has not been found`;
    }

    // Update the user's information
    if (name) {
        userToUpdate.name = name;
    }
    if (email) {
        userToUpdate.email = email;
    }

    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: database.users
    });

    res.send(userToUpdate);
});

// UC-207 Verwijderen van user
app.delete('/api/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    let statusCode = 200;

    // Find the index of the user in the array by ID
    const userIndexToRemove = users.findIndex(user => user.id === userId);

    // If the user is not found, send a 404 error response
    if (userIndexToRemove === -1) {
        statusCode = 404;
        message = `User not found`;
    }

    // Remove the user from the array
    users.splice(userIndexToRemove, 1);
    message = `User met ID ${userId} is verwijderd`
    // Send a success response with the updated user object
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: database.users
    });
    res.send(`User with ID ${userId} has been deleted`);
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
