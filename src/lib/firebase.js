// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initalize Firebase.
var firebaseConfig = {
  apiKey: 'AIzaSyDLEeV4dmIEGxq5kMnjTowcCBdQ-PJGVhw',
  authDomain: 'project-test-d1be1.firebaseapp.com',
  projectId: 'project-test-d1be1',
  storageBucket: 'project-test-d1be1.appspot.com',
  messagingSenderId: '353634772487',
  appId: '1:353634772487:web:752f8bedf7a617d622aca2',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
