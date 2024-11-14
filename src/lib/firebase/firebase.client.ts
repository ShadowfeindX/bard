// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGEtalLXJrNYvr8ZrNbN8nQMVyJJfSDK4",
  authDomain: "bard-54584.firebaseapp.com",
  projectId: "bard-54584",
  storageBucket: "bard-54584.firebasestorage.app",
  messagingSenderId: "1025105911913",
  appId: "1:1025105911913:web:2ade388b94091e9dc182f8",
  measurementId: "G-9TZNBVNGLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app as FirebaseApp };