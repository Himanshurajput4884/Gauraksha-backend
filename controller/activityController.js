const {firebaseApp, db, storage} = require("../db/db");
const {addDoc, collection, getDocs, doc, deleteDoc, getDoc} = require("firebase/firestore");
const { ref, uploadBytesResumable, getDownloadURL, deleteObject } = require("firebase/storage");
const multer = require("multer");

const upload = multer({storage:multer.memoryStorage()});
const activityCollectionRef = collection(db, "Activity");

const addBlog = async(req, res, next) =>{
    try{
        const file = req.file;
        const {title, subtitle, desc} = req.body;
        const fileName = `${Date.now()}_${file.originalname}`;

        console.log("FileName: ", fileName);
        const storageRef = ref(storage, `/activity/${fileName}`);

        const metadata = {
            contentType: file.mimetype,
        }
        
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL);

        const fileData = {
            title:title,
            subtitle:subtitle,
            desc:desc,
            fileName: fileName,
            url:downloadURL,
        }

        console.log("FileData: ", fileData);
        const docRef = await addDoc(activityCollectionRef, fileData);
        const blogId = docRef.id;

        return res.status(200).json({message:"BlogUploaded", blogId:blogId});
    }
    catch(err){
        console.log("Error in addBlog: ", err);
        return res.status(200).json({message:"Something went wrong in add new blog"});
    }
}


const showAllBlog = async(req, res, next)=>{
    try{
        const querySnapshot = await getDocs(activityCollectionRef);

        const blogs = [];
        querySnapshot.forEach((doc)=>{
            const blog = {
                blogId:doc.id,
                title:doc.data().title,
                subtitle:doc.data().subtitle,
                desc:doc.data().desc,
                imageName:doc.data().fileName,
                imageUrl:doc.data().url,
            }
            blogs.push(blog);
        })

        return res.status(200).json({message:"Fetch All blogs", blogs:blogs});
    }
    catch(err){
        console.log("Error in getting all blogs: ", err);
        return res.status(400).json({message:"Something went wrong in fetching all blogs"});
    }
}

const deleteBlog = async(req,res,next)=>{
    try{
        const documentId = req.params.id;
        console.log("DocumentId: ", documentId);
        if(!documentId){
            return res.status(401).json({message:"Document Id is missing"});
        }
        const docRef = doc(activityCollectionRef, documentId);
        const docSnapshot = await getDoc(docRef);

        if(!docSnapshot.exists()){
            return res.status(400).json({message:"Document not found"});
        }

        const fileName = docSnapshot.data().fileName;
        console.log("FileName: ", fileName);
        const storageRef = ref(storage, `/activity/${fileName}`);
        await deleteObject(storageRef);

        await deleteDoc(docRef);
        return res.status(200).json({message:"Blog deleted"});
    }
    catch(err){
        console.log("Error in deleting blog: ", err);
        return res.status(400).json({message:"Something went wrong in deleting blog"});
    }
}

module.exports = {
    addBlog,
    showAllBlog,
    deleteBlog,
}