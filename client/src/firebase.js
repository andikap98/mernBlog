// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-4d3ef.firebaseapp.com",
  projectId: "mern-blog-4d3ef",
  storageBucket: "mern-blog-4d3ef.appspot.com",
  messagingSenderId: "1043892831212",
  appId: "1:1043892831212:web:be97ee65884e242a4436c9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);