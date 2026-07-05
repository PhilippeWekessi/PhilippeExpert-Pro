import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config parsed from the automatically created config file
const firebaseConfig = {
  apiKey: "AIzaSyDlibqPbbVVtPhz7qEBaKTKAQxNDA0kbTY",
  authDomain: "striking-caldron-mfjbn.firebaseapp.com",
  projectId: "striking-caldron-mfjbn",
  storageBucket: "striking-caldron-mfjbn.firebasestorage.app",
  messagingSenderId: "196070326335",
  appId: "1:196070326335:web:3fc8f17c1d0d720c25b88a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
