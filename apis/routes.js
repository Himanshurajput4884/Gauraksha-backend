const express = require("express");
const router = express.Router();
const {addAdmin, loginAdmin, updatePassword} = require("../controller/adminController");
const adminVerify = require("../middleware/adminVerify.js");
const {addPhoto, showAllPhoto, deletePhoto} = require("../controller/galleryController.js");
const multer = require("multer");
const { addBlog, showAllBlog, deleteBlog } = require("../controller/activityController.js");

const upload = multer({storage: multer.memoryStorage()});
router.post("/admin/add", addAdmin);

router.post("/admin/login", loginAdmin);

router.post("/admin/update", adminVerify, updatePassword);

router.post("/gallery/add/new", upload.single('image'), addPhoto);

router.get("/gallery/show/all", showAllPhoto);

router.delete(`/gallery/delete/:id`, deletePhoto);

router.post("/activity/add/new", upload.single('image'), addBlog);

router.get("/activity/show/all", showAllBlog);

router.delete("/activity/delete/:id", deleteBlog);

module.exports = router;



// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiTVQwMDUwbXNLWFRTZ29EelZmTWgiLCJpYXQiOjE3MDQ4ODIyMDIsImV4cCI6MTcwNTc0NjIwMn0.vld9mjny-EafBKoYECNF1eYdO_2OGrwm6-47CGqXzdo"