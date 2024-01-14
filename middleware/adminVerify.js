const jwt = require("jsonwebtoken");
const config = require("../config.js");
const { firebaseApp, db } = require("../db/db.js");
const { collection, doc, getDoc } = require("firebase/firestore");

const adminCollectionRef = collection(db, 'Admin');

const adminVerify = async (req, res, next) => {
    const token =
        (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    console.log("Token in adminVerify: ", token);
    if (!token) {
        return res.status(400).json({ message: "Token not found" });
    }

    try {
        const getToken = jwt.verify(token, config.secretKey);
        const adminId = getToken.adminId;
        console.log("AdminId: ", adminId);

        const docRef = doc(adminCollectionRef, adminId); 
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            req.body.adminId = adminId;
            if(req.route.path === '/verify/token'){
                return res.status(200).json({message:"Correct-token"});
            }
            else{
                next();
            }
        } else {
            return res.status(400).json({ message: "Invalid Token" });
        }
    } catch (err) {
        console.log("Error in adminVerify: ", err);
        return res.status(500).json({ message: "Invalid Token" });
    }
}

module.exports = adminVerify;
