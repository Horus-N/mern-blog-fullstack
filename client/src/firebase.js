// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:process.env.REACT_APP_VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-336e9.firebaseapp.com",
  projectId: "mern-blog-336e9",
  storageBucket: "mern-blog-336e9.appspot.com",
  messagingSenderId: "1065376609057",
  appId: "1:1065376609057:web:c4edabb686af9c9fbf8460"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);