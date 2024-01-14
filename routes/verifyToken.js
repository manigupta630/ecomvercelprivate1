const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.cookies.token;
    if (authHeader) {
        // const token = authHeader.split(" ")[1];
        const token = authHeader;
        jwt.verify(token, process.env.JWT_SEC, (err, user)=> {
            if (err) res.status(401).json("Token is invalid");
            req.user = user;
            next();
        } );

    } else {
        return res.status(401).json("You are not authenticated");
    }
}
const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req, res, ()=>{
        // console.log(req,"authverify.............");
        if (req.user.id || req.user.isAdmin == true) {
            next();
        }
        else { res.status(403).json("you are not allowed ")
    }

    })
}

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req, res, ()=>{
        if (req.user.isAdmin == true) {
            next();
        }
        else { res.status(403).json("you are not allowed ")
    }
    })
}

module.exports = { verifyToken , verifyTokenAndAuthorization , verifyTokenAndAdmin };