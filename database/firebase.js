import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdyHOLS8rRPOjP493ISE-fh0OhEM375jw",
  authDomain: "appiosrecetas.firebaseapp.com",
  projectId: "appiosrecetas",
  storageBucket: "appiosrecetas.firebasestorage.app",
  messagingSenderId: "782273903015",
  appId: "1:782273903015:web:7c2d3182ff04449c481e82",
  measurementId: "G-PWTF4542W6"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default {
  firebase,
  db
};