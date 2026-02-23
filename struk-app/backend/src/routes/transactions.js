const router = require('express').Router()
const { TransactionController } = require('../controllers')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, TransactionController.getAll)
router.get('/deleted', authMiddleware, TransactionController.getDeleted)
router.get('/:id', authMiddleware, TransactionController.getById)
router.post('/', authMiddleware, TransactionController.create)
router.put('/:id/restore', authMiddleware, TransactionController.restore)
router.delete('/:id', authMiddleware, TransactionController.destroy)
router.delete('/:id/permanent', authMiddleware, TransactionController.permanentDelete)

module.exports = router
