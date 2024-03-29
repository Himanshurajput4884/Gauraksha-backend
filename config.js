const dotenv = require("dotenv");
dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    SECRET_KEY,
} = process.env;


module.exports = {
    port:PORT,
    host:HOST,
    url:HOST_URL,
    secretKey:SECRET_KEY,
    firebaseConfig:{
        apiKey:API_KEY,
        authDomain:AUTH_DOMAIN,
        projectId:PROJECT_ID,
        storageBucket:STORAGE_BUCKET,
        messagingSenderId:MESSAGING_SENDER_ID,
        appId:APP_ID,
        measurementId:MEASUREMENT_ID
    }
}
