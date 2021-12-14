import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyBMrHLIIC8S3Tdyv3we1w5JtJGAP1ItK4Q",
    authDomain: "timechallenge-1f630.firebaseapp.com",
    projectId: "timechallenge-1f630",
    storageBucket: "timechallenge-1f630.appspot.com",
    messagingSenderId: "828666293063",
    appId: "1:828666293063:web:1c151a8865399ed71b3a62"
});

export const auth = getAuth(app);
export const database = getFirestore(app);
export default app;