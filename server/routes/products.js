const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/auth');
var checkRole = require('../services/checkRole');

router.post("/add", auth.authToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    console.log(product)
    query = "insert into products(name, category_id, description, price, status) value(?,?,?,?,'true')";
    connection.query(query, [product.name, product.catogeryId, product.description, product.price], (err, result) => {
        if (!err) {
            return res.status(200).json({ msg: "Category Added Successfully" });
        }
        else {
            console.log(err)
            return res.status(500).json(err)
        }
    })
})

router.get("/get", auth.authToken, (req, res) => {
    query = "select p.id, p.name, p.description, p.price, p.status, c.id as categoryId, c.name as categoryName from products as p INNER JOIN category as c where p.category_id = c.id";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {
            return res.status(500).json(err)
        }
    })
})

router.get("/getByCategory/:id", auth.authToken, (req, res) => {
    const id = req.params.id
    query = "select id, name,description,price  from products where category_id = ? and status='true'";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {
            return res.status(500).json(err)
        }
    })
})

router.get("/getById/:id", auth.authToken, (req, res) => {
    const id = req.params.id
    query = "select id, name,description,price from products where id = ?";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).json(result[0]);
        }
        else {
            return res.status(500).json(err)
        }
    })
})

router.patch("/update", auth.authToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    query = "update products set name=?,category_id=?,description=?,price=? where id=?";
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ msg: "product id does not found" })
            }
            return res.status(200).json({ msg: "product updated Successfully" });
        }
        else {
            return res.status(500).json(err)
        }
    })
})

router.patch("/updateStatus", auth.authToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    query = "update products set status=? where id=?";
    connection.query(query, [product.status, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ msg: "product id does not found" })
            }
            return res.status(200).json({ msg: "product updated Successfully" });
        }
        else {
            return res.status(500).json(err)
        }
    })
})


router.delete("/delete/:id", auth.authToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from products where id=?";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ msg: "Product id does not found" })
            }
            return res.status(200).json({ msg: "Product Deleted Successfully" })
        } else {
            return res.status(500).json(err);
        }
    })
})





module.exports = router;







