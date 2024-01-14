const router = require('express').Router();
const User = require("../models/User")
const { verifyToken, verifyTokenAndAuthorization , verifyTokenAndAdmin} = require("./verifyToken")
// Put
router.put('/:id', verifyTokenAndAuthorization, async (req,res) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, Number(process.env.saltRounds)) }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.body.params, {
            $set : req.body,
        }, {new:true})
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(401).json(err);
    }
}) 

// Delete 
router.delete('/:id', verifyTokenAndAdmin, async (req,res,) => {
    try {
        await User.findByIdAndUpdate(req.body.params);
        res.status(200).json("User is deleted...");
    } catch {
        res.status(401).json(err)
    }
})

// Get User
router.get('/find/:id', verifyTokenAndAdmin, async (req,res,) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(req.params.id)
        const { password, ...userWithoutPassword } = user._doc;
        console.log({ ...userWithoutPassword });
        res.status(200).json({...userWithoutPassword});
    } catch(err) {
        res.status(401).json(err)
    }
})

// Get All User
router.get('/users', verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({_id : -1}).limit(2) : await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(401).json(err)
    }
})

// Get User Stats
router.get('/stats', verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await User.aggregate([
            { $match : { createdAt : { $gte : lastyear } } },
            { $project : { month : { $month : "$createdAt" } } }, 
            { $group : { _id : "$month" , total : { $sum : 1 } }}
        ]);
        res.status(200).json(data);
        console.log(data);
    } catch(err) {
        
    }
})

module.exports=router;