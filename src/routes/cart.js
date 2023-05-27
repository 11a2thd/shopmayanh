const express = require('express')
const router = express.Router()

const cartController = require('../app/controller/CartController')

router.get('/', cartController.show)
router.put('/check/:_id/:slug', cartController.check)
router.put('/check/:_id', cartController.check)
router.put('/del/:_id', cartController.del)
router.put('/:slug', cartController.paid)
router.put('/quantity/:_id/:slug', cartController.quantity)

module.exports = router