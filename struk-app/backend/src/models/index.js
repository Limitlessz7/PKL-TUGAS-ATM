const Transaction = require('./Transaction')
const TransactionItem = require('./TransactionItem')
const Admin = require('./Admin')

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items', onDelete: 'CASCADE' })
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' })

module.exports = { Transaction, TransactionItem, Admin }
