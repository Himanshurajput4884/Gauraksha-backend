const express = require("express");
const router = express.Router();
const {addAdmin, loginAdmin, updatePassword} = require("../controller/adminController");
const adminVerify = require("../middleware/adminVerify.js");
const {addPhoto, showAllPhoto, deletePhoto} = require("../controller/galleryController.js");
const multer = require("multer");
const { addBlog, showAllBlog, deleteBlog } = require("../controller/activityController.js");
const { checkout, paymentVerification, getKey } = require("../controller/paymentController.js");

const upload = multer({storage: multer.memoryStorage()});
// token verification
router.get("/verify/token", adminVerify);

// admin routes
router.post("/admin/add", addAdmin);

router.post("/admin/login", loginAdmin);

router.post("/admin/update", adminVerify, updatePassword);


// gallery routes
router.post("/gallery/add/new", upload.single('image'), addPhoto);

router.get("/gallery/show/all", showAllPhoto);

router.delete(`/gallery/delete`, adminVerify, deletePhoto);


// activity routes
router.post("/activity/add/new", upload.single('image'), addBlog);

router.get("/activity/show/all", showAllBlog);

router.delete("/activity/delete", deleteBlog);


// payment routes
router.get("/payment/getkey", getKey);

router.post("/payment/checkout", checkout);

router.post("/payment/paymentverification", paymentVerification);

module.exports = router;



// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiTVQwMDUwbXNLWFRTZ29EelZmTWgiLCJpYXQiOjE3MDQ4ODIyMDIsImV4cCI6MTcwNTc0NjIwMn0.vld9mjny-EafBKoYECNF1eYdO_2OGrwm6-47CGqXzdo"