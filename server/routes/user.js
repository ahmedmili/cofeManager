const express = require('express');
const connection = require('./../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config()


router.post('/signup',(req,res)=>{
    var user = req.body;
    query = "select email,password,role,status from users where email =?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length <=0){
                query = "insert into users(name,contactNumber,email,password,status,role) values (?,?,?,?,'false','user') "
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(errr,resultt)=>{
                    if(!errr){
                        // console.log('sucess')
                        return res.status(200).json({message : "sucessfully Registred"})
                    }
                    else{
                        // console.log(errr)
                        return res.status(500).json(errr)
                        // throw errr
                    }
                })
            }
        }
        else{
            console.log("acc existe")
            return res.status(400).json({message : "email already existe"})
        }
    })
})

router.post('/login',(req,res)=>{
    var user = req.body;
    query = "select email,password,role,status from users where email =?"
    connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,result)=>{
        if(!err){
            // console.log('sucess')
            if((result.length <= 0) || (result[0].password != user.password)){
                return res.status(401).json({message:"Incorrect Username or Password"})
            }else if (result[0].status === 'false'){
                return res.status(401).json({message:"wait for admin Approval"})
            }else if(result[0].password == user.password){
                // need code here
            }else{
                return res.status(400).json({message:"somethins went wrong. Please try again later"});
            }

        }else {
                return res.status(500).json(err)
        }
    }

})


module.exports = router;