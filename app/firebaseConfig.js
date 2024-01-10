// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHatgNhCWjEcQyoAHGaXvJRPA--EKDrTw",
  authDomain: "project-chat-410811.firebaseapp.com",
  projectId: "project-chat-410811",
  storageBucket: "project-chat-410811.appspot.com",
  messagingSenderId: "719221376180",
  appId: "1:719221376180:web:a42fce030a2f1a8ae103e1",
  measurementId: "G-53ZK5Q9K6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
