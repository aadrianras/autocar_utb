import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
  apiKey: 'AIzaSyC6IJpnB5VttmjmG6T4OtwyCDCPV_bn18I',
  authDomain: 'autocar-utb.firebaseapp.com',
  projectId: 'autocar-utb',
  storageBucket: 'autocar-utb.appspot.com',
  messagingSenderId: '1008389320290',
  appId: '1:1008389320290:web:6b5885340069f6cc6b6b3b'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
