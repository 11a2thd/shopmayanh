const Product = require('../models/Product')
const Buy = require('../models/Buy')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')

class CartController{

        show(req, res, next){

            Promise.all([Product.find({}).lean(), Buy.find({}).lean()])
            .then(([product, buy]) => {
                const pData = product
                const bData = []
                pData.forEach(function(pData){
                    pData.price = String(pData.price)
                    for(var i = pData.price.length - 3; i > 0; i -= 3)
                    pData.price = pData.price.slice(0, i) + '.' + pData.price.slice(i)
                    
                })
                buy.forEach(function(buy){
                    buy.selected.forEach(function(buy){
                        bData.push( buy )
                    })
                })

                var totalC = 0
                var totalA = 0
                bData.forEach(function(bData){
                    totalA += (bData.price * bData.quantity.value)
                    if(bData.check !== "")
                    totalC += (bData.price * bData.quantity.value)
                    bData.price = String(bData.price)
                    for(var i = bData.price.length - 3; i > 0; i -= 3)
                    bData.price = bData.price.slice(0, i) + '.' + bData.price.slice(i)
                    
                })

                res.render('products/cart', {
                    product: pData,
                    buy: bData,
                })
            })
            .catch(err => console.log("Lỗi!!!"))
    }

    check(req, res){

        Buy.findOne({ user_name: "ngocnhatbruh" })
            .then(buy => {
                if(req.params._id === '0' || req.params._id === '1'){
                    if(req.params._id === '1')
                    buy.selected.forEach(function(product){
                        product.check = 'checked'
                    })
                    else {
                        buy.selected.forEach(function(product){
                            product.check = ''
                        })
                    }
                    
                }
                else{
                    buy.selected.forEach(function(product){
                        if(product._id == req.params._id && product.check !== ""){
                            product.quantity.value = Number(req.params.slug)
                            return product.check = ""
                        }
                        
                        if(product._id == req.params._id && product.check !== "check"){
                            product.quantity.value = Number(req.params.slug)
                            return product.check = "checked"
                        }
                    })
                }
                Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                    .then(() => res.redirect('/cart'))
                    .catch(err => { console.log("1 Lỗi!!!") })
            })
            .catch(err => { console.log("3 Lỗi!!!") })
    }

    del(req, res){
        if(req.params._id === 'xoa'){
            Buy.findOne({ user_name: "ngocnhatbruh" })
            .then(buy => {
                buy.selected.splice(buy.selected)


                Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                .then(() => res.redirect('/cart'))
                .catch(err => { console.log("1 Lỗi!!!") })
                
                
            })
            .catch(err => { console.log("3 Lỗi!!!") })
        }
        else{
            Buy.findOne({ user_name: "ngocnhatbruh" })
                .then(buy => {
                    buy.selected.forEach(function(product, index){
                        if(product._id == req.params._id)
                        return buy.selected.splice(index, 1)
                    })
                    Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                    .then(() => res.redirect('/cart'))
                    .catch(err => { console.log("1 Lỗi!!!") })
                    
                    
                })
                .catch(err => { console.log("3 Lỗi!!!") })
            }
        
    }

    paid(req, res){

        Buy.findOne({ user_name: "ngocnhatbruh" })
            .then(buy => {
                var tong = 0
                var a = {
                      stt: 0,
                      products: [
                        {
                            quantity: {
                                value: 0,
                                type: "number"
                            },
                            check: "",
                            name: "",
                            img: "",
                            price: 0,
                            _id: ""
                        }
                      ],
                      sale_code: 0,
                      total: { 
                        old: 0,
                        new: 0,
                      }
                    }
                a.stt = buy.paid.length + 1
                
                buy.selected.forEach(function (product, index) {
                    a.products[index] = {
                        quantity: product.quantity.value,
                        check: product.check,
                        name: product.name,
                        img: product.img,
                        price: product.price,
                        _id: product._id
                    }
                })
                
                
                buy.selected.forEach(function(product) {
                    tong += (product.price * product.quantity.value)
                })
                for(var i = 0; i < req.params.slug.length; i++){
                    var c = req.params.slug
                    var gia = '', e = 0
                    for(var j = 0; j < c.length; j++)
                    if(c[j] === '.'){
                        gia += c.slice(e, j)
                        e = j + 1
                    }
                    gia += c.slice(e, c.length)
                }
                a.total.old = tong
                a.total.new = Number(gia)
                buy.paid.unshift(a)
                buy.selected.splice(buy.selected)
                Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                .then(() => res.redirect('/cart'))
                .catch(err => { console.log("1 Lỗi!!!") })
                
                    
            })
            .catch(err => { console.log("3 Lỗi!!!") })
    }

    quantity(req, res){

        Buy.findOne({ user_name: "ngocnhatbruh" })
            .then(buy => {
                buy.selected.forEach(function(product, index){
                    if(product._id == req.params._id)
                    return product.quantity.value = Number(req.params.slug)
                    
                })
                Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                .then(() => res.redirect('/cart'))
                .catch(err => { console.log("1 Lỗi!!!") })
                
                    
            })
            .catch(err => { console.log("3 Lỗi!!!") })
    }

}

module.exports = new CartController