const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');

router.get('/', async (req, res) => {
  try {
    const users = await UserService.fetchAndStoreUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const users = await UserService.searchUsers(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 