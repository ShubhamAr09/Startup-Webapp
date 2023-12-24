// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "startup-webapp-63b27.firebaseapp.com",
  projectId: "startup-webapp-63b27",
  storageBucket: "startup-webapp-63b27.appspot.com",
  messagingSenderId: "363079076122",
  appId: "1:363079076122:web:8f134e7a7aba75144d44a3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
