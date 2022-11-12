const express = require('express');
const connection = require('./../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config()
 const nodemailer = require('nodemailer')

var auth = require('../services/auth');
var checkRole = require('../services/checkRole');

router.post('/signup',(req,res)=>{
    var user = req.body;
    query = "select email,password,role,status from users where email =?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            // console.log(result.length)
            if(result.length <=0){
                query = "insert into users(name,contactNumber,email,password,status,role) values (?,?,?,?,'false','user') "
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(errr,resultt)=>{
                    if(!errr){
                        // console.log('sucess')
                        return res.status(200).json({message : "sucessfully Registred"})
                    }
                    else{
                        console.log(errr)
                        return res.status(500).json({message :"errr"})
                        // throw errr
                    }
                })
            }else{
                console.log("email existe")
                return res.send({msg:"email already existe"})
            }
        }
        else{
            console.log("err contact dev team")
            return res.status(400).json({message : err})
        }
    })
})

router.post('/login',(req,res)=>{
    var user = req.body;
    // console.log(user)
    query = "select * from users where email =?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            console.log(result[0].PASSWORD)
            if((result.length <= 0) || (result[0].PASSWORD != user.password)){
                // console.log(result)
                return res.status(401).json({message:"Incorrect Username or Password"})
            }else if (result[0].status === 'false'){
                return res.status(401).json({message:"wait for admin Approval"})
            }else if(result[0].PASSWORD == user.password){
                // need code here
                // return res.status(200).json({message:"sucesse"})
                const response = { email: result[0].email,role: result[0].role}
                const ACCESS_TOKEN = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'})
                res.status(200).json({token: ACCESS_TOKEN})
            }else{
                return res.status(400).json({message:"somethins went wrong. Please try again later"});
             }
            
        }
    })
})


// node mailer 
var transporter =  nodemailer.createTransport({
    service : "gmail",
    auth:{
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})


router.post('/forgetpassword',(req,res)=>{
    const user = req.body
    query = "select email,password from users where email=?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length <=0){
                return res.status(200).json({msg : "Password sent successfully to your email 11"})
            }else{
                var mailOptions = {
                    FormData: process.env.EMAIL,
                    to:result[0].email,
                    subject : 'passowr by cafe Manager Sytem',
                    html : '<p><b>Your Login deyail for Cafe Manager System</b>Email'+result[0].email+'<br> <b>Password</b>'+result[0].password+'<br><a href="http://localhost:4200">Click here to login </a></p>'
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error)
                    }else{
                        console.log("Email sent : "+info.response);
                    }
                });
                return res.status(200).json({msg : "Password sent successfully to your email"})
            }
        }else{
            return res.status(500).json(err)
        }
    })
})

// get user
router.get("/get",auth.authToken,checkRole.checkRole,(req,res)=>{
    var query = "select * from users where role='user'";
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }else{
            return res.status(500).json(err);
        }
    });
});


//update user 
router.patch('/update',auth.authToken,checkRole.checkRole,(req,res)=>{
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,result)=>{
        if(!err){
            if(result.affectedRow == 0){
                return res.status(404).json({msg:"user id does not exist"});
            }
            return res.status(200).json({msg:"user updated successfully"});
        }else{
            return res.status(500).json(err)
        }

    })
})

router.get("/checkToken",auth.authToken,checkRole.checkRole, (req,res)=>{
    return res.status(200).json({msg:"true"})
})

router.post("/changePassword",(req,res)=>{
    const user = req.body;
    const email = res.locals.email;
    var query = "select * from users where email=? and password=?"
    connection.query(query,[email,user.oldPassword],(err,result)=>{
        if(!err){
            if(result.length<=0){
                return res.status(400).json({msg:"incorrect old password"})
            }else if(result[0].password == user.oldPassword){
                query = "update users set password=? where email=?"
                connection.query(query,[user.newPassword,email],(err,result)=>{
                    if(!err){
                        return res.status(200).json({msg:"password updated Successfully"})
                    }else{
                        return res.status(500).json(err)
                    }
                })

            }else{
                return res.status(400).json({msg:"somethings went wrong , please try again later"})
            }
        }else{
            return res.status(500).json(err)
        }
    })
})

module.exports = router;