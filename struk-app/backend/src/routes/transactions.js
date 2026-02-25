const router = require('express').Router()
const { TransactionController } = require('../controllers')
const authMiddleware = require('../middleware/auth')
const requireRole = require('../middleware/role')

router.get('/', authMiddleware, TransactionController.getAll)
router.get('/deleted', authMiddleware, requireRole('admin'), TransactionController.getDeleted)
router.get('/:id', authMiddleware, TransactionController.getById)
router.post('/', authMiddleware, TransactionController.create)
router.put('/:id/restore', authMiddleware, requireRole('admin'), TransactionController.restore)
router.delete('/:id', authMiddleware, requireRole('admin'), TransactionController.destroy)
router.delete('/:id/permanent', authMiddleware, requireRole('admin'), TransactionController.permanentDelete)

module.exports = router
