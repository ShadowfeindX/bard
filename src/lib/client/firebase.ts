// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { collection, doc, addDoc, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { dev } from "$app/environment";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
*/
const firebaseConfig = {
  apiKey: "AIzaSyBGEtalLXJrNYvr8ZrNbN8nQMVyJJfSDK4",
  authDomain: "bard-54584.firebaseapp.com",
  databaseURL: "https://bard-54584-default-rtdb.firebaseio.com",
  projectId: "bard-54584",
  // storageBucket: "bard-54584.firebasestorage.app",
  // messagingSenderId: "1025105911913",
  appId: "1:1025105911913:web:2ade388b94091e9dc182f8",
  // measurementId: "G-9TZNBVNGLR"
};

const firebaseDevConfig = {
  apiKey: 'any',
  authDomain: 'any',
  projectId: 'demo-bard', // project name from .firebaserc
  storageBucket: 'any',
  messagingSenderId: 'any',
  appId: 'any',
};

// Initialize Firebase
const app = initializeApp(dev ? firebaseDevConfig : firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore();
// connectFirestoreEmulator(db, 'localhost', 8080);

const auth = getAuth(app);

export const generateFirebaseId = () => doc(collection(db,'generateID')).id;

console.log('firebase initialized')

export { app, db, auth };