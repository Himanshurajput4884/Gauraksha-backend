const {firebaseApp, db, storage} = require("../db/db");
const {addDoc, collection, getDocs, doc, deleteDoc, getDoc} = require("firebase/firestore");
const {ref, uploadBytesResumable, getDownloadURL, deleteObject} = require("firebase/storage");
const multer = require("multer");


const upload = multer({storage: multer.memoryStorage()});
const galleryCollectionRef = collection(db, 'Gallery');

const addPhoto = async(req, res, next) =>{
    try{
        const file = req.file;
        console.log("File: ", file);
        const fileName = `${Date.now()}_${file.originalname}`;
        console.log("FileName: ", fileName);
        const storageRef = ref(storage, `/gallery/${fileName}`);
        // create file metadata including the content type

        const metadata = {
            contentType: file.mimetype,
        };
        // upload file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL);

        const fileData = {
            fileName: fileName,
            url:downloadURL,
        }
        console.log("FileData: ", fileData);
        
        const docRef = await addDoc(galleryCollectionRef, fileData);
        const fileId = docRef.id;

        return res.status(200).json({message:"FileUploaded", fileId:fileId});

    }
    catch(err){
        console.log("Error in AddPhoto: ", err);
        return res.status(400).json({message:"Something went wrong in add new photo"});
    }
}


const showAllPhoto = async(req, res, next)=>{
    try{
        const querySnapshot = await getDocs(galleryCollectionRef);

        const galleryImages = [];
        querySnapshot.forEach((doc)=>{
            const imageData = {
                imageId:doc.id,
                imageName:doc.data().fileName,
                imageUrl:doc.data().url,
            }
            galleryImages.push(imageData);
        });

        return res.status(200).json({message:"Fetch All Image", galleryImages:galleryImages});
    }
    catch(err){
        console.log("Error in getting all files: ", err);
        return res.status(400).json({message:"Something went wrong in fetching all files"});
    }
}


const deletePhoto = async(req,res,next)=>{
    try{
        console.log(req.params);
        const documentId = req.params.id;
        console.log("DocumentId: ", documentId);
        if(!documentId){
            return res.status(401).json({message:"Image Id is missing"});
        }
        const docRef = doc(galleryCollectionRef, documentId);
        const docSnapshot = await getDoc(docRef);

        if(!docSnapshot.exists()){
            return res.status(400).json({message:"Document not found"});
        }
        const fileName = docSnapshot.data().fileName;
        console.log("FileName: ", fileName);
        const storageRef = ref(storage, `/gallery/${fileName}`);
        await deleteObject(storageRef);

        await deleteDoc(docRef);

        return res.status(200).json({message:"Image Deleted"});
    }
    catch(err){
        console.log("Error in deleting the photo", err);
        return res.status(400).json({message:"Something went wrong in deleting this photo"});
    }
}

module.exports = {
    addPhoto,
    showAllPhoto,
    deletePhoto,
}