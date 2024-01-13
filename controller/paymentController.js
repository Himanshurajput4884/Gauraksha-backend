const {instance} = require("../server.js");
const crypto = require("crypto");
const {firebaseApp, db} = require("../db/db.js");
const { collection, addDoc } = require("firebase/firestore");



const paymentCollectionRef = collection(db, 'Payments');
console.log(instance);

const checkout = async(req, res)=>{
    try{
        const options = {
            amount:Number(req.body.amount*100),
            currency:"INR",
        }

        const order = await instance.orders.create(options);

        res.status(200).json({message:"Order Created", order:order});
    }   
    catch(err){
        console.log("Error in creating order: ", err);
        return res.status(400).json({message:"Something went wrong"});
    }
}


const paymentVerification = async(req, res)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
        .update(body.toString()).digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if(isAuthentic){
            // Save in Database
            const dataToSave = {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            }

            const docRef = await addDoc(paymentCollectionRef, dataToSave);
            const newId = docRef.id;

            return res.status(200).json({message:"Payment Success"});
        }
        else{
            return res.status(400).json({message:"Invalid Payment"});
        }
    }
    catch(err){
        console.log("Error in payment verification: ", err);
        return res.status(400).json({message:"Something went wrong in payment verification"});
    }
}


const getKey = (req, res)=>{
    return res.status(200).json({message:"Get key", key:process.env.RAZORPAY_API_KEY});
}

module.exports = {
    checkout,
    paymentVerification,
    getKey,
}


