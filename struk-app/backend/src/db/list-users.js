require('dotenv').config()
const { sequelize } = require('./index')
const { User } = require('../models')

async function main() {
  try {
    await sequelize.authenticate()
    console.log('DB connected')
    const users = await User.findAll({ attributes: ['id','username','name','email','role','createdAt'] })
    if (!users.length) {
      console.log('No users found')
    } else {
      console.table(users.map(u => u.get({ plain: true })))
    }
    process.exit(0)
  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  }
}

main()
