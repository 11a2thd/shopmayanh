const Product = require('../models/Product')
const Buy = require('../models/Buy')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')

class HomeController{

    index(req, res){

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
                bData.forEach(function(bData){
                    bData.price = String(bData.price)
                    for(var i = bData.price.length - 3; i > 0; i -= 3)
                    bData.price = bData.price.slice(0, i) + '.' + bData.price.slice(i)
                    
                })
                pData.reverse()

                res.render('home', {
                    product: pData,
                    buy: bData
                })
            })
            .catch(err => console.log("Lỗi!!!"))
    }

    cart(req, res){

        Promise.all([Product.findOne({ _id: req.params._id }), Buy.findOne({ user_name: "ngocnhatbruh" })])
            .then(([product, buy]) => {
                var formData = {...{ check: "" }, ...product._doc}
                formData.quantity = {
                    value: 1,
                    maxValue: product.quantity
                }
                var x = 0
                buy.selected.forEach(function(cartProduct){
                    if(cartProduct._id == req.params._id)
                    return x++
                })
                if(x === 0)
                buy.selected.push(formData)
                Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                .then(() => res.redirect('/'))
                .catch(err => { console.log("1 Lỗi!!!") })
            })
            .catch(err => { console.log("2 Lỗi!!!") })
        
    }

    sort(req, res){
            Promise.all([Product.find({}).lean(), Buy.find({}).lean()])
            .then(([product, buy]) => {
                var pData = product
                var bData = []
                if(req.params.slug === 'price-ascending')
                pData.sort((a, b) => a.price - b.price);
                else if(req.params.slug === 'price-descending')
                pData.sort((a, b) => b.price - a.price)
                else if(req.params.slug === 'price-lower-20')
                pData = pData.filter(function(value) {
                    return value.price < 20000000;
                });
                else if(req.params.slug === 'price-20-to-40')
                pData = pData.filter(function(value) {
                    if(value.price >= 20000000 && value.price <= 40000000)
                    return value;
                });
                else if(req.params.slug === 'price-40-to-70')
                pData = pData.filter(function(value) {
                    if(value.price >= 40000000 && value.price <= 70000000)
                    return value;
                });
                else if(req.params.slug === 'price-upper-70')
                pData = pData.filter(function(value) {
                    return value.price > 70000000;
                });

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
                bData.forEach(function(bData){
                    bData.price = String(bData.price)
                    for(var i = bData.price.length - 3; i > 0; i -= 3)
                    bData.price = bData.price.slice(0, i) + '.' + bData.price.slice(i)
                    
                })
                
                res.render('home', {
                    product: pData,
                    buy: bData
                })
            })
            .catch(err => console.log("Lỗi!!!"))
    }
}

module.exports = new HomeController
