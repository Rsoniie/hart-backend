// Import the functions you need from the SDKs you need
const {initializeApp} = require('firebase/app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUqx0v-5LxbepOpb2Qp0MFxF2nmjBP3RA",
    authDomain: "realate-dating.firebaseapp.com",
    databaseURL: "https://realate-dating-default-rtdb.firebaseio.com",
    projectId: "realate-dating",
    storageBucket: "realate-dating.appspot.com",
    messagingSenderId: "808180923750",
    appId: "1:808180923750:web:6ab65ca41abb41b5715ca7",
    measurementId: "G-185WKHD7WR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;