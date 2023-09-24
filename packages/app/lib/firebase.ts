import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBIfrLIz6FzjmRc5YMBBsg1yZtxUHwcLM8',
  authDomain: 'gala-8700f.firebaseapp.com',
  databaseURL:
    'https://gala-8700f-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'gala-8700f',
  storageBucket: 'gala-8700f.appspot.com',
  messagingSenderId: '448155788848',
  appId: '1:448155788848:web:ae578750ec66f1f2cc2ff5',
  measurementId: 'G-FVM5YMSQYT',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
