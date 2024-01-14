const { verifyToken , verifyTokenAndAuthorization , verifyTokenAndAdmin } = require('./verifyToken');
const Cart = require("../models/Cart");
const User = require('../models/User');
const router = require('express').Router();

// Create
router.post('/', verifyToken, async(req, res) => {
    const newCart = new Cart(req.body);
    const userid = req.user;
    console.log(userid, "user id");
    const item = {
        userId : userid.id,
        products : [ {
            productId : req.body.productId,
            quantity : req.body.quantity,
        }]
    }
    console.log(item, "------------item");
    try {
        console.log("------------try")
        const savedCart = new Cart(item);
        await savedCart.save();
        console.log(savedCart)
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
        console.log(error, "------------error")
    }
})

// update 
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

// delete 
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

// carts 
router.get("/find/:userId", verifyTokenAndAuthorization ,async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        res.status(500).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get All Carts
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try {
        const cart = await Cart.find();
        res.status(500).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports=router;