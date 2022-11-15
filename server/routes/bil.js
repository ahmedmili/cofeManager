const express = require('express');
const connection = require('../connection');
const router = express.Router();

let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
var uuid = require("uuid");

var auth = require('../services/auth');
const { resourceLimits } = require('worker_threads');
// var checkRole = require('../services/checkRole');

router.post('/generateReport',auth.authToken,(req,res)=>{
    const generateuuid = uuid.v1();
    const orderDetails = req.body;
    // console.log(orderDetails)
    var productDetailsString = JSON.stringify(orderDetails.productDetails)
    var productDetailsReport = JSON.parse(productDetailsString);
    // console.log(productDetailsReport)
    var query = "insert into bille (name, uuid, contactNumber, paymentMethod, total,productDetails, createdBy) values(?,?,?,?,?,?,?)"
    connection.query(query,[
                            orderDetails.name,
                            generateuuid,
                            orderDetails.contactNumber,
                            orderDetails.paymentMethod,
                            orderDetails.totalAmount,
                            productDetailsString,
                            res.local.email
            ],(err,result)=>{
        if(!err){
            // console.log(__dirname)
            ejs.renderFile(path.join(__dirname,"report.ejs"),{
                productDetails:productDetailsReport,
                name:orderDetails.name,
                email:orderDetails.email,
                contactNumber:orderDetails.contactNumber,
                paymentMethod:orderDetails.paymentMethod,
                totalAmount:orderDetails.totalAmount
            },(err,results)=>{
                if(err){
                    console.log(err)
                    return res.status(500).json(err);
                }else{
                    pdf.create(results).toFile('./generated_pdf/'+generateuuid+'.pdf',function(err,data){
                        if(err){
                            console.log(err);
                            return res.status(500).json(err);
                        }else{
                            return res.status(200).json({uuid:generateuuid})
                        }
                    })
                }
            })
        }else{
            return res.status(500).json(err)
        }
    })

})


router.post



module.exports 