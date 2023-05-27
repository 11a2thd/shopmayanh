const express = require('express')
const router = express.Router()

const siteController = require('../app/controller/OrderController')

router.get('/', siteController.show)

module.exports = router