const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cookieparser = require('cookie-parser');
const port = process.env.PORT || 5000;
dotenv.config()
// process.env.MONGO_URL
// mongodb+srv://manigupta630:<password>@cluster0.mz92jws.mongodb.net/
// mongoose.connect('mongodb://0.0.0.0:27017/ecom', { 
mongoose.connect('mongodb+srv://manigupta630:WPMpwCtGVdK6XZU8@cluster0.yd2utad.mongodb.net/', {
        // useCreateIndex : true,
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(() => console.log("Connecting to db") )
    .catch((err => {
        console.log(err)
    } ));

app.use(express.json());
app.use(cookieparser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.listen(port, (req,res) => {
    console.log("Backend is running at port", port);
}) 
app.get('/', (req,res) => {
    res.send("hi");
} )