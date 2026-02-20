const router = require('express').Router()
const { ExternalController } = require('../controllers')

router.get('/ping', ExternalController.ping)

module.exports = router
