import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// seu Firebase (isso você já tem)
const firebaseConfig = {
  apiKey: "AIzaSyCsoi-us9x6va-QTygJVWIXi9k_nLta8Ls",
  authDomain: "kanban-brmobility.firebaseapp.com",
  projectId: "kanban-brmobility",
  storageBucket: "kanban-brmobility.firebasestorage.app",
  messagingSenderId: "792111549567",
  appId: "1:792111549567:web:571f171f254a89a92c834a"
};

// inicializa Firebase
const app = initializeApp(firebaseConfig);

// 🔥 ISSO AQUI É O BANCO (FIRESTORE)
const db = getFirestore(app);
