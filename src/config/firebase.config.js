import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyC65l6HacEddN5UTzmusHjwPh6U11kei-A",
  authDomain: "resume-builder-c5257.firebaseapp.com",
  projectId: "resume-builder-c5257",
  storageBucket: "resume-builder-c5257.appspot.com",
  messagingSenderId: "51891128356",
  appId: "1:51891128356:web:76dd4f7db92b0fe558f0b1",
  measurementId: "G-H66FHSHJ7J"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app);
const db = getFirestore(app)

export {auth , db};

  