const express = require('express')
const router = express.Router()

const homeController = require('../app/controller/HomeController')

router.get('/', homeController.index)
router.put('/:_id', homeController.cart)
router.get('/sort_by/:slug', homeController.sort)
router.put('/sort_by/:_id', homeController.cart)
// router.get('/:slug', homeController.show)



module.exports = router