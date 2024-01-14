const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
router.post("/user", async(req, res) => {
    const Hashpass = await bcrypt.hash(req.body.password, Number(process.env.saltRounds));
    const newUser = new User( {
        username: req.body.username,
        email : req.body.email,
        password: Hashpass
    })
    // console.log(Hashpass);
    try {
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(201).json(savedUser);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}
)
// Login
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ username : req.body.username });
        if (user) {
            const checkpass = bcrypt.compareSync(req.body.password, user.password); 
            if (checkpass) {
                // const { password, ...others } = user;
                // console.log({ others });
                const { password, ...userWithoutPassword } = user._doc;
                console.log({ others: userWithoutPassword });
                const accesstoken = jwt.sign(
                    {
                    id : user._id,
                    isAdmin : user.isAdmin,
                    }, 
                    process.env.JWT_SEC,
                    {expiresIn:'3d'}
                );
                const options = {
                    expires: new Date(
                      Date.now() + 3000 * 24 * 60 * 60 * 1000
                    ),
                    secure:false,
                    httpOnly: true,
                  };
                res.status(201).cookie("token", accesstoken, options).json({...userWithoutPassword, accesstoken});    
                // console.log({ others, accesstoken }); 

            }
            else {
                console.log("incorecct pass");
                res.status(401).json("incorecct pass"); 

            }     
            }
        else {
            console.log("incorrect");
            res.status(201).json(checkpass);
        }
        
    } catch(err) {
        res.status(500).json(err);
        console.log(err);

    }

}
)
module.exports=router;