const { firebaseApp, db } = require("../db/db");
const { collection, query, where, getDocs, setDoc, doc, addDoc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");
const config = require("../config.js");
const bcrypt = require("bcryptjs");

// db is firestore 

const adminCollectionRef = collection(db, 'Admin'); // Use collection for referencing a collection

const addAdmin = async (req, res, next) => {
    console.log("AddAdmin: ", req.body);
    try {
        const { username, password } = req.body;

        const quuri = query(adminCollectionRef, where('username', '==', username));
        const querySnapshot = await getDocs(quuri);

        if (querySnapshot.empty) {
            const encryptedPass = await bcrypt.hash(password, 10);

            const data = {
                username: username,
                password: encryptedPass,
            }

            const docRef = await addDoc(adminCollectionRef, data);

            const newId = docRef.id;
            const token = jwt.sign({
                adminId: newId
            }, config.secretKey, {
                expiresIn: "10d",
            });

            console.log(token);

            return res.status(200).json({ message: "admin added", token: token });
        } else {
            return res.status(500).json({ message: "username already exist" });
        }
    } catch (err) {
        console.log("Error in AddAdmin: ", err);
        return res.status(400).json({ message: "Something wrong went" });
    }
}

const loginAdmin = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const q = query(adminCollectionRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(400).json({ message: "Incorrect username and password" });
        }

        const firstDoc = querySnapshot.docs[0];
        const hashedPassword = firstDoc.data().password;

        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                throw new Error(err);
            } else if (isMatch) {
                const adminId = firstDoc.id;
                const token = jwt.sign({
                    adminId: adminId
                }, config.secretKey, {
                    expiresIn: "10d",
                });

                console.log(token);
                return res.status(200).json({ message: "admin login", token: token });
            } else {
                return res.status(400).json({ message: "Incorrect username and password" });
            }
        });
    } catch (err) {
        console.log("Error occur in loginAdmin: ", err);
        return res.status(400).json({ message: "Something went wrong" });
    }
}

const updatePassword = async (req, res, next) => {
    const { username, password, newPassword, adminId } = req.body;
    console.log("UpdatePassword: ", req.body);
    if (!username || !password || !newPassword) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (password === newPassword) {
        return res.status(400).json({ message: "password and newPassword are the same" });
    }
    try {
        const q = query(adminCollectionRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return res.status(400).json({ message: "Username doesn't exist" });
        }
        const firstDoc = querySnapshot.docs[0];
        let hashedPassword = firstDoc.data().password;
        bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
            if (err) {
                throw new Error(err);
            } else if (isMatch) {
                const encryptedPass = await bcrypt.hash(newPassword, 10);
                const adminDocRef = doc(adminCollectionRef, adminId); // Use doc for referencing a specific document
                await setDoc(adminDocRef, { username: username, password: encryptedPass });
                return res.status(200).json({ message: "password update" });
            } else if (!isMatch) {
                return res.status(400).json({ message: "Incorrect username and password" });
            }
        });
    } catch (err) {
        console.log("Error in updatePassword: ", err);
        return res.status(400).json({ message: "Something went wrong" });
    }
}

module.exports = {
    addAdmin,
    loginAdmin,
    updatePassword,
}
