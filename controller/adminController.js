const {firebaseApp, firestore} = require("../db/db.js");
const {collection, query, where, getDocs, setDoc, doc, addDoc} = require("firebase/firestore");
const Admin = require("../models/admin.js");
const jwt = require("jsonwebtoken");
const config = require("../config.js");
const bcrypt = require("bcryptjs");
const { isMainThread } = require("worker_threads");

// db is firestore 

const adminCollectionRef = collection(firestore,'Admin');

const addAdmin = async(req, res, next)=>{
    console.log("AddAdmin: ",req.body);
    try{
        const {username, password} = req.body;

        // const querySnapshot = await adminCollectionRef.where('username','==',username).get();
        // create a query against the collection
        const quuri = query(adminCollectionRef, where('username','==',username));
        // getDocs to get the documents
        const querySnapshot = await getDocs(quuri);
        if(querySnapshot.empty){
            const encryptedPass = await bcrypt.hash(password, 10);

            // const docRef = adminCollectionRef.doc();
            // const newAdmin = new Admin(username, encryptedPass);
            console.log(encryptedPass);
            const data = {
                username:username,
                password:encryptedPass,
            }
            const docRef = await addDoc(adminCollectionRef, data);
            
            const newId = docRef.id;
            const token = jwt.sign({
                adminId: newId
            },
            config.secretKey,
            {
                expiresIn:"10d",
            });
            console.log(token);
            
            return res.status(200).json({message:"admin added", token:token});
        }
        else{
            return res.status(500).json({message:"username already exist"});
        }
    }
    catch(err){
        console.log("Error in AddAdmin: ", err);
        return res.status(400).json({message:"Something wrong went"});
    }
}


const loginAdmin = async(req, res, next)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({message:"Missing required fields"});
    }
    try{
        const querySnapshot = await adminCollectionRef.where('username','==',username).get();

        if(querySnapshot.empty){
            return res.status(400).json({message:"Incorrect username and password"});
        }
        const firstDoc = querySnapshot.docs[0];
        let hashedPassword = firstDoc.data().password;
        const adminId = firstDoc.id;
        bcrypt.compare(password, hashedPassword, (err, isMatch)=>{
            if(err){
                throw new Error(err);
            }
            else if(isMatch){
                const token = jwt.sign({
                    adminId:adminId
                },
                config.secretKey,
                {
                    expiresIn:"10d",
                });
                console.log(token);
                return res.status(200).json({message:"admin login", token:token});
            }
            else if(!isMatch){
                return res.status(400).json({message:"Incorrect username and password"});
            }
        })

        if(querySnapshot.empty){
            return res.status(400).json({message:"Incorrect username and password"});
        }

    }
    catch(err){
        console.log("Error occur in loginAdmin: ", err);
        return res.status(400).json({message:"Something wrong went"});
    }
}

const updatePassword = async(req, res, next)=>{
    const {username,password,newPassword,adminId} = req.body;
    if(!username || !password || !newPassword){
        return res.status(400).json({message:"Missing required fields"});
    }
    if(password === newPassword){
        return res.status(400).json({message:"password and newPassword are same"});
    }
    try{
        const querySnapshot = await adminCollectionRef.where('username','==',username).get();
        const firstDoc = querySnapshot.docs[0];
        let hashedPassword = firstDoc.data().password;
        bcrypt.compare(password, hashedPassword, async (err,isMatch)=>{
            if(err){
                throw new Error(err);
            }
            else if(isMatch){
                const encryptedPass = await bcrypt.hash(newPassword, 10); 
                const adminDoc = await adminCollectionRef.doc(adminId);
                await adminDoc.update({username:username, password:encryptedPass});
                return res.status(200).json({message:"password update"});
            }
            else if(!isMatch){
                return res.status(400).json({message:"Incorrect username and password"});
            }
        })
    }
    catch(err){

    }
}


module.exports = {
    addAdmin,
    loginAdmin,
    updatePassword,
}
