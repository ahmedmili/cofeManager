const express = require('express');
var cors = require('cors');
const connection = require('./connection')
const userRoute = require("./routes/user")
const categoryRoute =require('./routes/category')
const productsRoute =require('./routes/products')
const billRoute =require('./routes/bil')
const dashboardRoute =require('./routes/dashboard')
const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/user',userRoute)
app.use('/category',categoryRoute)
app.use('/products',productsRoute)
app.use('/bill',billRoute)
app.use('/dashboard',dashboardRoute)

module.exports = app;






