const router = require('express').Router()
const { TransactionController } = require('../controllers')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, TransactionController.getAll)
router.get('/:id', authMiddleware, TransactionController.getById)
router.post('/', authMiddleware, TransactionController.create)
router.delete('/:id', authMiddleware, TransactionController.destroy)

module.exports = router
