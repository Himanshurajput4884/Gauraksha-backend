const express = require("express");
const router = express.Router();
const {addAdmin, loginAdmin, updatePassword} = require("../controller/adminController");
const adminVerify = require("../middleware/adminVerify.js");

router.post("/admin/add", addAdmin);

router.post("/admin/login", loginAdmin);

router.post("/admin/update", adminVerify, updatePassword);

module.exports = router;