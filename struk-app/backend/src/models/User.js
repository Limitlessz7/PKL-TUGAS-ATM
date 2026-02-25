const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/index')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  name: { type: DataTypes.STRING(120), allowNull: true },
  email: { type: DataTypes.STRING(120), allowNull: true },
  role: { type: DataTypes.ENUM('admin', 'cashier'), allowNull: false, defaultValue: 'cashier' }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
})

User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = User
