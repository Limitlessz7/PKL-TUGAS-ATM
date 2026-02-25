require('dotenv').config()
const { sequelize } = require('./index')
const { Transaction, TransactionItem, Admin, User } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

async function main() {
  await sequelize.sync({ alter: true })

  // Create default admin
  const adminExists = await Admin.findOne({ where: { username: 'admin' } })
  if (!adminExists) {
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      email: 'admin@example.com'
    })
    console.log('Admin user created: username=admin, password=admin123')
  }

  // Create example users (roles: admin, cashier)
  const [userAdmin, createdAdmin] = await User.findOrCreate({ where: { username: 'admin' }, defaults: { password: 'admin123', name: 'User Administrator', email: 'useradmin@example.com', role: 'admin' } })
  if (createdAdmin) console.log('User admin created: username=admin, password=admin123')

  const [userCashier, createdCashier] = await User.findOrCreate({ where: { username: 'cashier' }, defaults: { password: 'kasir123', name: 'Kasir', email: 'kasir@example.com', role: 'cashier' } })
  if (createdCashier) console.log('User cashier created: username=cashier, password=kasir123')

  const items = [
    { name: 'Konsultasi', qty: 1, price: 100000 },
    { name: 'USG', qty: 1, price: 150000 }
  ]
  const totals = computeTotals(items, 0, 0, 300000)

  const trx = await Transaction.create({
    code: makeCode(),
    patientName: 'Contoh Pasien',
    userId: (userAdmin && userAdmin.id) || null,
    unit: 'Poli KIA',
    paymentMethod: 'Cash',
    note: 'Terima kasih.',
    ...totals
  })

  await TransactionItem.bulkCreate(items.map(it => ({ transactionId: trx.id, ...it })))

  console.log('Seed inserted:', trx.id)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
