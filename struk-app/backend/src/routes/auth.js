const router = require('express').Router()
const { AuthController } = require('../controllers')

router.post('/login', AuthController.login)

// Debug: unlock account (clears in-memory failed attempts)
router.post('/unlock', AuthController.unlock)

// Dev routes to inspect/reset locks
router.get('/locks', AuthController.getLocks)
router.post('/reset-locks', AuthController.resetAllLocks)

module.exports = router
