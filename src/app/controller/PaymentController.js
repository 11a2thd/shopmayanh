const Product = require('../models/Product')
const Buy = require('../models/Buy')
const { response } = require('express')

class PaymentController{

    show(req, res, next){

        Buy.findOne({ user_name: 'ngocnhatbruh' }).lean()
        .then(buy => {
            var bData = []
            buy.selected.forEach(product => {
                if(product.check === "checked")
                bData.push(product)
            })

            res.render('products/payment', {
                buy: bData,
            })
        })
        .catch(err => console.log("Lỗi!!!"))
    }

    paid(req, res){

        Buy.findOne({ user_name: "ngocnhatbruh" })
            .then(buy => {
                
                var tong = 0
                var a = {
                      stt: 0,
                      payment: "",
                      products: [
                        {
                            quantity: 0,
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
                if(req.params.slug2 === '1')
                a.payment = 'Tiền mặt'
                else if(req.params.slug2 === '2')
                a.payment = 'Chuyển khoản'
                
                buy.selected.forEach(function (product, index) {
                    if(product.check === 'checked'){
                        a.products[index] = {
                            quantity: product.quantity.value,
                            name: product.name,
                            img: product.img,
                            price: product.price,
                            _id: product._id
                        }
                        tong += (a.products[index].quantity * a.products[index].price)
                    }
                    
                    
                })

                a.total.old = tong
                a.total.new = Number(req.params.slug1)              
                
                buy.paid.unshift(a)
                buy.selected.splice(buy.selected)
                Buy.updateOne({ user_name: "ngocnhatbruh" }, buy)
                .then(() => res.redirect('/payment/succeeded'))
                .catch(err => { console.log("1 Lỗi!!!") })
                
                    
            })
            .catch(err => { console.log("3 Lỗi!!!") })
    }

    succeeded(req, res){
        res.render('products/succeeded')
    }

}

module.exports = new PaymentController