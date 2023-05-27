const express = require('express')
const router = express.Router()

const paymentController = require('../app/controller/PaymentController')

router.get('/', paymentController.show)
router.put('/:slug1/:slug2', paymentController.paid)
router.get('/succeeded', paymentController.succeeded)

module.exports = router