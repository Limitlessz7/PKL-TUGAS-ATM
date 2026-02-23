const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/index')
const bcrypt = require('bcryptjs')

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  name: { type: DataTypes.STRING(120), allowNull: true },
  email: { type: DataTypes.STRING(120), allowNull: true }
}, {
  tableName: 'admins',
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        const salt = await bcrypt.genSalt(10)
        admin.password = await bcrypt.hash(admin.password, salt)
      }
    }
  }
})

Admin.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = Admin
