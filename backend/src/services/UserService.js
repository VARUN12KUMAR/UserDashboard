const axios = require('axios');
const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

class UserService {
  static async fetchAndStoreUsers() {
    try {
      const response = await axios.get('https://randomuser.me/api/?results=20');
      const users = response.data.results;
      let newUsers = 0;
      let updatedUsers = [];

      for (const userData of users) {
        try {
          const [user, created] = await User.findOrCreate({
            where: { email: userData.email },
            defaults: {
              email: userData.email,
              firstName: userData.name.first,
              lastName: userData.name.last,
              age: userData.dob.age,
              gender: userData.gender,
              phone: userData.phone,
              picture: userData.picture.large,
              location: {
                street: userData.location.street,
                city: userData.location.city,
                state: userData.location.state,
                country: userData.location.country,
                coordinates: userData.location.coordinates,
                timezone: userData.location.timezone
              },
              apiId: userData.login.uuid
            }
          });

          if (created) {
            newUsers++;
            updatedUsers.push(user);
          }
        } catch (error) {
          console.error(`Error processing user ${userData.email}:`, error.message);
          continue; // Skip this user and continue with the next one
        }
      }

      console.log(`✓ Added ${newUsers} new users to the database at ${new Date().toISOString()}`);
      return updatedUsers;
    } catch (error) {
      console.error('✗ Error fetching users:', error.message);
      throw error;
    }
  }

  static startPeriodicFetch(io) {
    // Initial fetch
    this.fetchAndBroadcast(io);

    // Set up interval for periodic fetching (20 seconds)
    const interval = setInterval(() => this.fetchAndBroadcast(io), 20000);

    // Return the interval ID for cleanup
    return interval;
  }

  static async fetchAndBroadcast(io) {
    try {
      const newUsers = await this.fetchAndStoreUsers();
      if (newUsers.length > 0) {
        io.emit('newUsers', {
          timestamp: new Date().toISOString(),
          users: newUsers
        });
        console.log(`✓ Broadcast ${newUsers.length} new users to connected clients`);
      }
    } catch (error) {
      console.error('✗ Error in fetch and broadcast cycle:', error.message);
    }
  }

  static async searchUsers(query) {
    try {
      return await User.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      console.error('✗ Error searching users:', error.message);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('✗ Error getting user:', error.message);
      throw error;
    }
  }

  static async getStats() {
    try {
      const totalUsers = await User.count();
      const genderStats = await User.findAll({
        attributes: ['gender', [sequelize.fn('COUNT', '*'), 'count']],
        group: ['gender']
      });
      const avgAge = await User.findOne({
        attributes: [[sequelize.fn('AVG', sequelize.col('age')), 'averageAge']]
      });
      const locations = await User.findAll({
        attributes: [
          [sequelize.fn('COUNT', '*'), 'count'],
          [sequelize.col('location.country'), 'country']
        ],
        group: ['location.country'],
        order: [[sequelize.fn('COUNT', '*'), 'DESC']],
        limit: 5
      });

      return {
        totalUsers,
        genderStats: genderStats.reduce((acc, curr) => {
          acc[curr.gender] = parseInt(curr.get('count'));
          return acc;
        }, {}),
        averageAge: Math.round(parseFloat(avgAge.get('averageAge')) || 0),
        topLocations: locations.map(l => ({
          country: l.get('country'),
          count: parseInt(l.get('count'))
        }))
      };
    } catch (error) {
      console.error('✗ Error getting user stats:', error.message);
      throw error;
    }
  }

  static stopPeriodicFetch(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
      console.log('✓ Stopped periodic user fetching');
    }
  }
}

module.exports = UserService; 