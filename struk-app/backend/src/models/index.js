const Transaction = require('./Transaction')
const TransactionItem = require('./TransactionItem')
const Admin = require('./Admin')
const User = require('./User')

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items', onDelete: 'CASCADE' })
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' })

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' })
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = { Transaction, TransactionItem, Admin, User }
