const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./apis/routes");
const dotenv = require("dotenv");
const config = require("./config");
const Razorpay = require("razorpay");
// const db = require("./db/db.js");
// const firestore = db.firestore();
dotenv.config();



const app = express();
app.use(cors());

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://gau-raksha-frontend.vercel.app", "https://gaushala-admin.vercel.app"];

app.use(function(req, res, next) {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(router);

// console.log(config.firebaseConfig);

const PORT = config.port;
app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
});

