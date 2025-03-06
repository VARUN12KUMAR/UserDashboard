const UserService = require('../services/UserService');
const { ValidationError, NotFoundError } = require('../utils/errors');

class UserController {
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.fetchAndStoreUsers();
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchUsers(req, res, next) {
    try {
      const { query } = req.query;
      
      if (!query) {
        throw new ValidationError('Search query is required');
      }

      const users = await UserService.searchUsers(query);
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req, res, next) {
    try {
      const stats = await UserService.getStats();
      res.status(200).json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController; 