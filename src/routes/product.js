const express = require('express')
const router = express.Router()

const productController = require('../app/controller/ProductController')

router.post('/store', productController.store)
router.get('/create', productController.create)
router.put('/:_id', productController.cart)
router.get('/:slug', productController.show)

module.exports = router