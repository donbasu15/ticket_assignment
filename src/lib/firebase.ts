import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAztnJuq-q0ZiwDxyPn2BZpM6MZzEhYZHY",
  authDomain: "ticket-224ec.firebaseapp.com",
  projectId: "ticket-224ec",
  storageBucket: "ticket-224ec.firebasestorage.app",
  messagingSenderId: "441436720308",
  appId: "1:441436720308:web:ccf006899dd2860db15be1",
  measurementId: "G-QJFQBSN022"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);