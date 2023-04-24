const database = require('../util/database');
const logger = require('../util/utils').logger;
const assert = require('assert');

const userController = {

  // UC-202 - Opvragen van overzicht van users
  getAllUsers: (req, res, next) => {
    logger.info('Get all users');
    // er moet precies 1 response verstuurd worden.
    const statusCode = 200;
    res.status(statusCode).json({
      status: statusCode,
      message: 'User getAll endpoint',
      data: database.users
    });
  },

  // UC-202 - Opvragen van overzicht van users met  filters
  getUserFiltered: (req, res) => {
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
      status: 200,
      message: "Users with filter",
      data: filteredUsers
    });
  },

  // UC-201 - Registreren als nieuwe user
  createUser: (req, res) => {
    logger.info('Register user');

    const user = req.body;
    logger.debug('user = ', user);

    // Hier zie je hoe je binnenkomende user info kunt valideren.
    try {
      // assert(user === {}, 'Userinfo is missing');
      assert(typeof user.firstName === 'string', 'firstName must be a string');
      assert(
        typeof user.emailAdress === 'string',
        'emailAddress must be a string'
      );
    } catch (err) {
      logger.warn(err.message.toString());
      res.status(400).json({
        status: 400,
        message: err.message.toString(),
        data: {}
      });
      return;
    }

    user.id = database.index++;
    database['users'].push(user);
    logger.info('New user added to database');

    res.status(201).json({
      status: 201,
      message: `User met id ${user.id} is toegevoegd`,
      data: user
    });
  },

  // UC-206 - Verwijderen van user
  deleteUser: (req, res) => {
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
  },

  // UC-203  Opvragen van gebruikersprofiel
  getUserProfile: (req, res) => {
    // Usergegevens en userId
    const statusCode = 200;
    res.status(statusCode).json({
      status: statusCode,
      message: "Get all user profiles",
      data: database.users
    });
  },

  // UC-204 Opvragen van usergegevens bij ID
  getUserByID: (req, res) => {
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
  },

  // UC-205 Wijzigen van usergegevens
  updateUser: (ewq, res) => {
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
  }
}

module.exports = userController;
