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


router.post("/getPdf",auth.authToken,(req,res)=>{
    const orderDetails = req.body;
    const pdfPath = "./generated_pdf/"+orderDetails.uuid+".pdf";
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport = JSON.parse(JSON.stringify( orderDetails.productDetails))
       
        ejs.renderFile(path.join(__dirname,"report.ejs"),{
            productDetails:productDetailsReport,
            name:orderDetails.name,
            email:orderDetails.email,
            contactNumber:orderDetails.contactNumber,
            paymentMethod:orderDetails.paymentMethod,
            totalAmount:orderDetails.totalAmount
        },function(err,results){
            if(err){
                return res.status(500).json(err);
            }else{
                pdf.create(results).toFile(pdfPath,function(err,data){
                    if(err){
                      
                        return res.status(500).json(err);
                    }else{
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);           
                     }
                })
            }
        })
    
    }
})

router.get("/getBills",auth.authToken,(req,res)=>{
    var query = "select * from bille order by id DESC"
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results)
        }else{
            return res.status(500).json(err); 
        }
    })
})  

router.delete("/delete/:id",auth.authToken,(req,res)=>{
    const id = req.params.id
    var query = "delete from bille where id=?"
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({msg:"bill id does not found"})
            }
            return res.status(200).json({msg:"Bill Deleted Successfully"})
        }else{
            return res.status(500).json(err); 
        }
    })
})





module.exports = router;


