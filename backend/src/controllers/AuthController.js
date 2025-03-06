const AuthService = require('../services/AuthService');
const { ValidationError, AuthenticationError, NotFoundError } = require('../utils/errors');

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      // Input validation
      if (!username || !email || !password) {
        throw new ValidationError('All fields are required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
      }

      // Password strength validation
      if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        throw new ValidationError('Password must contain at least one uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        throw new ValidationError('Password must contain at least one number');
      }

      const token = await AuthService.register(username, email, password);
      res.status(201).json({
        status: 'success',
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      if ((!username && !email) || !password) {
        throw new ValidationError('Username/email and password are required');
      }

      const token = await AuthService.login(username, email, password);
      res.status(200).json({
        status: 'success',
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      if (!user) {
        throw new NotFoundError('User profile not found');
      }

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { email, currentPassword, newPassword } = req.body;
      
      if (!currentPassword) {
        throw new ValidationError('Current password is required');
      }

      const updatedUser = await AuthService.updateProfile(req.user.id, {
        email,
        currentPassword,
        newPassword
      });
      
      const token = AuthService.generateToken(updatedUser);
      res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: { token, user: updatedUser }
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const token = AuthService.generateToken(user);
      res.status(200).json({
        status: 'success',
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController; 