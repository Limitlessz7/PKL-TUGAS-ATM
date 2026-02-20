const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/index')

const TransactionItem = sequelize.define('TransactionItem', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  transactionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

  name: { type: DataTypes.STRING(140), allowNull: false },
  qty: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 }
}, {
  tableName: 'transaction_items'
})

module.exports = TransactionItem
