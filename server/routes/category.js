const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/auth');
var checkRole = require('../services/checkRole');

router.post("/add",auth.authToken,checkRole.checkRole,(req,res)=>{
    let category = req.body;
    query = "insert into category (name) value(?)";
    connection.query(query,[category.name],(err,result)=>{
        if(!err){
            return res.status(200).json({msg:"Category Added Successfully"});
        }
        else{
            return res.status(500).json(err)
        }
    })
})

router.get("/get",auth.authToken,(req,res)=>{
    query = "select * from category order by name";
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }
        else{
            return res.status(500).json(err)
        }
    })
})


router.patch("/update",auth.authToken,checkRole.checkRole,(req,res)=>{
    let product = req.body;
    query = "update category set name=? where id=?";
    connection.query(query,[product.name,product.id],(err,result)=>{
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({msg:"caategory id does not found"})
            }
            return res.status(200).json({msg:"Category updated Successfully"});
        }
        else{
            return res.status(500).json(err)
        }
    })
})


module.exports = router;
















