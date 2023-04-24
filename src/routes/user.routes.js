const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// UC-201 Registreren als nieuwe user
router.post('', userController.createUser);

// UC-202 Opvragen van overzicht van users
router.get('', userController.getAllUsers);
router.get('', userController.getUserFiltered);

// UC-203  Opvragen van gebruikersprofiel 
router.get('/profile', userController.getUserProfile);

// UC-204 Opvragen van usergegevens bij ID
router.get('/:userId', userController.getUserByID);

// UC-205 Wijzigen van usergegevens
router.put('/:userId', userController.updateUser);

// UC-206 - Verwijderen van user
router.delete('', userController.deleteUser);

module.exports = router;
