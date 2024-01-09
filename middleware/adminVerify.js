const jwt = require("jsonwebtoken");
const config = require("../config.js");
const {firebaseApp, firestore} = require("../db/db.js");
const {collection} = require("firebase/firestore");


const adminCollectionRef = collection(firestore, 'Admin');

const adminVerify = async (req,res,next)=>{
    const token = req.body.token ||
    req.query.token || 
    req.headers["x-access-token"] ||
    req.headers.authorization;

    console.log("Token: ", token);
    if(!token){
        return res.status(400).json({message:"Token not found"});
    }
    
    try{
        const getToken = jwt.verify(token, config.secretKey);
        const adminId = getToken.adminId;

        const docRef = adminCollectionRef.doc(adminId);
        const docSnopshot = await docRef.get();

        if(docSnopshot.exists){
            req.body.adminId = adminId;
            next();
        }   
        else{
            return res.status(400).json({message:"Invalid Token"});
        }
    }
    catch(err){
        console.log("Error in adminVerify: ", err);
        return res.status(400).json({message:"Invalid Token"});
    }
}


module.exports = adminVerify;