// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
var firebaseConfig = {
  apiKey: "AIzaSyAxzJAKfHjf6z_VZ2bXyM872DmHRatY-Pw",
  authDomain: "tcl-35-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-35-smart-shopping-list",
  storageBucket: "tcl-35-smart-shopping-list.appspot.com",
  messagingSenderId: "284148869267",
  appId: "1:284148869267:web:29f0e9a532b46357ee0566"
};

const firebaseInstance = firebase.initializeApp(firebaseConfig);
const db = firebaseInstance.firestore();

export { db };
