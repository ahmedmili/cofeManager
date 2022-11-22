const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/auth');



router.get("/details",
    auth.authToken,
    (req,res,next)=>{
    var categoreyCount;
    var productCount;
    var billCount;
    // console.log(req.headers.authorization)
    var query = "select count(id) as categoreyCount from category";
    
    connection.query(query,(err,results)=>{
        if(!err){
            categoreyCount = results[0].categoreyCount;
        }else{
            return res.status(500).json(err)
        }
    })
    
    query = "select count(id) as productCount from products";
    connection.query(query,(err,results)=>{
        if(!err){
            productCount = results[0].productCount;
        }else{
            return res.status(500).json(err)
        }
    })
    
    query = "select count(id) as billCount from bille";
    connection.query(query,(err,results)=>{
        if(!err){
            billCount = results[0].billCount;
            var data = {
                categoreyCount:categoreyCount,
                productCount:productCount,
                billCount:billCount
            }
            res.status(200).json(data)
        }else{
            return res.status(500).json(err)
        }
    })
})

module.exports = router;