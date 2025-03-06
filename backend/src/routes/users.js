const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', UserController.getUsers);
router.get('/search', UserController.searchUsers);
router.get('/stats', UserController.getUserStats);
router.get('/:id', UserController.getUserById);

module.exports = router; 