// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_APIKEY,
  authDomain: import.meta.env.VITE_API_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_API_DATABASEURL,
  projectId: import.meta.env.VITE_API_PROJECTID,
  storageBucket: import.meta.env.VITE_API_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_API_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_API_APPID,
  measurementId: import.meta.env.VITE_API_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const database = getDatabase(app);
// console.log("database",database)

// saveUserDataFireDB();

// function saveUserDataFireDB() {
//   try {
//     set(ref(database, 'system'), {1:1});
//   } catch (error) {
//     console.error('Error adding document: ', error);
//   }
// }
export { app, auth};
