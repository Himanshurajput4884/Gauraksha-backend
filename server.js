const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./apis/routes");
const dotenv = require("dotenv");
const config = require("./config");
dotenv.config();

const app = express();
app.use(cors());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000", "http://localhost:3001");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(router);

const PORT = config.port;
app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
});

