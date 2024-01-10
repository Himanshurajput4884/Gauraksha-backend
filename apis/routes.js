const express = require("express");
const router = express.Router();
const {addAdmin, loginAdmin, updatePassword} = require("../controller/adminController");
const adminVerify = require("../middleware/adminVerify.js");

router.post("/admin/add", addAdmin);

router.post("/admin/login", loginAdmin);

router.post("/admin/update", adminVerify, updatePassword);

module.exports = router;



// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiTVQwMDUwbXNLWFRTZ29EelZmTWgiLCJpYXQiOjE3MDQ4ODIyMDIsImV4cCI6MTcwNTc0NjIwMn0.vld9mjny-EafBKoYECNF1eYdO_2OGrwm6-47CGqXzdo"