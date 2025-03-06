const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class AuthService {
  static async register(username, email, password) {
    try {
      // Validate input
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }

      // Check if username or email already exists
      const existingUser = await Auth.findOne({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.username === username) {
          throw new Error('Username already exists');
        }
        if (existingUser.email === email) {
          throw new Error('Email already exists');
        }
      }

      // Create new user
      const auth = await Auth.create({
        username,
        email,
        password
      });

      return this.generateToken(auth);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  static async login(username, email, password) {
    try {
      // Find user by username or email
      const auth = await Auth.findOne({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (!auth) {
        throw new Error('User not found');
      }

      const isValid = await auth.validatePassword(password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      return this.generateToken(auth);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const user = await Auth.findByPk(userId, {
        attributes: ['id', 'username', 'email']
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  static async updateProfile(userId, { email, currentPassword, newPassword }) {
    try {
      const user = await Auth.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValid = await user.validatePassword(currentPassword);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Update email if provided and different
      if (email && email !== user.email) {
        // Check if email is already in use
        const existingEmail = await Auth.findOne({
          where: {
            email,
            id: { [Op.ne]: userId }
          }
        });

        if (existingEmail) {
          throw new Error('Email already in use');
        }
        user.email = email;
      }

      // Update password if provided
      if (newPassword) {
        user.password = newPassword;
      }

      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static generateToken(auth) {
    return jwt.sign(
      { 
        id: auth.id, 
        username: auth.username, 
        email: auth.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthService; 