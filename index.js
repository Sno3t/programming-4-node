const express = require("express");
const assert = require("assert");

const app = express();
const port = 3000;
const routes = require('src/routes/routes')

// For access to application/json request body
app.use(express.json());

const database = require('./src/utils/database')

let index = database.users.length;

app.use("*", (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});

// Info endpoints
app.get("/api/info", (req, res) => {
  res.status(201).json({
    status: 201,
    message: "Server info-endpoint",
    data: {}
  });
});

// todo: USER UC  --------------------------------------------------------------

// UC-201 Registreren als nieuwe user
app.post("/api/user", (req, res) => {
  const user = req.body;
  console.log("user = ", user);
  user.id = index++;
  let status = 200;
  let message = `User met id ${user.id} is toegevoegd`;
  let data = {};

  if (user.firstName !== "string"){
    status = 400;
    message = "firstName must be a string";
    data = {}

  } else if (user.emailAdress !== "string"){
    status = 400;
    message = "emailAddress must be a string";
    data = {}
  } else {
    database["users"].push(user);
  }

  res.status(status).json({
    status: status,
    message: message,
    data: user
  });
});

// UC-202 Opvragen van overzicht van users
app.get("/api/user", (req, res) => {
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    message: "User getAll endpoint",
    data: database.users
  });
});

// UC-202 Opvragen van overzicht van users met filter
app.get("/api/user", (req, res) => {
  const statusCode = 200;

  const filters = req.query;
  let filteredUsers = users;

  if (filters.firstName) {
    filteredUsers = filteredUsers.filter(user => user.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
  } else if (filters.lastName) {
    filteredUsers = filteredUsers.filter(user => user.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
  } else if (filters.emailAdress) {
    filteredUsers = filteredUsers.filter(user => user.emailAdress.toLowerCase().includes(filters.emailAdress.toLowerCase()));
  }

  res.status(statusCode).json({
    status: statusCode,
    message: "User get filtered",
    data: filteredUsers
  });
});


// UC-203  Opvragen van gebruikersprofiel
app.get("/api/user/profile", (req, res) => {
  // Usergegevens en userId
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    message: "Get all user profiles",
    data: database.users
  });
});

// UC-204 Opvragen van usergegevens bij ID
app.get("/api/user/:userId ", (req, res) => {
  // Usergegevens en userId
  const userIdToFind = parseInt(req.params.userId);

  database.users.forEach(function(user) {
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


// UC-205 Wijzigen van usergegevens
app.put("/api/user/:userId", (req, res) => {
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

// UC-206 Verwijderen van user
app.delete("/api/user/:userId", (req, res) => {
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
  message = `User met ID ${userId} is verwijderd`;
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
app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint not found",
    data: {}
  });
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
