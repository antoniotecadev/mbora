import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCRevSFiqHU5TfNNgGHc2bgAPi9MseAxaM",
    authDomain: "mborasystem-admin.firebaseapp.com",
    databaseURL: "https://mborasystem-admin-default-rtdb.firebaseio.com",
    projectId: "mborasystem-admin",
    storageBucket: "mborasystem-admin.appspot.com",
    messagingSenderId: "1024278380960",
    appId: "1:1024278380960:web:12858512d52c11572c24c5",
    measurementId: "G-BCM11LWG6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;