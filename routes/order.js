const { verifyToken , verifyTokenAndAuthorization , verifyTokenAndAdmin } = require('./verifyToken');
const Order = require("../models/Order");
const User = require('../models/User');
const router = require('express').Router();

// Create Order
router.post('/', verifyTokenAndAuthorization, async(req, res) => {
    try {
        const userid = req.user;
        console.log(userid.id);
        const newOrder = {
            userId : userid.id,
            products : [ {
                productId : req.body.productId,
                quantity : req.body.quantity,
            }], 
            amount : req.body.amount,
            address : req.body.address,
            status : req.body.status,
        }
        const savedOrder = new Order(newOrder);
        await savedOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

// update 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: body.req }, { new: true });
        res.status(200).json(updatedOrder);
        console.log(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
})

// delete 
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

// user order
router.get("/find/userorder", verifyTokenAndAuthorization, async(req, res) => {
    try {
        const userid = req.user;
        // console.log(userid.id);
        console.log(userid.id);
        const orders = await Order.find({userId : userid.id});
        console.log(orders);
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err);
    }
})

// all orders
router.get("/allorders", verifyTokenAndAdmin ,async (req, res) => {
    const qNew = req.query.new;
    try {
        products = qNew ? await Product.find().sort({ createdAt: -1 }) : Product.find();
        res.status(200).json(products); 
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports=router;