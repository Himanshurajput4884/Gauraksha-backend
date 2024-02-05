const Razorpay = require("razorpay");
const dotnev = require("dotenv");

dotnev.config();


const instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET,
});

// console.log("Razorpay instance created:", instance);

module.exports = instance;