const router = require('express').Router()
const { TransactionController } = require('../controllers')

router.get('/', TransactionController.getAll)
router.get('/:id', TransactionController.getById)
router.post('/', TransactionController.create)
router.delete('/:id', TransactionController.destroy)

module.exports = router
