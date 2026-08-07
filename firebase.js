// firebase.js

import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

import {
  getAuth
} from "firebase/auth";

import {
  getStorage
} from "firebase/storage";



const firebaseConfig = {

  apiKey: "AIzaSyDCriMhMqBaeU6TV66_AT_fh4hI2rRcbyhg",

  authDomain: "ahmed-r-exams.firebaseapp.com",

  projectId: "ahmed-r-exams",

  storageBucket: "ahmed-r-exams.firebasestorage.app",

  messagingSenderId: "43039605037",

  appId: "1:43039605037:web:585929f674373ea40e93a4"

};



const app =
initializeApp(firebaseConfig);



export const auth =
getAuth(app);



export const db =
getFirestore(app);



export const storage =
getStorage(app);