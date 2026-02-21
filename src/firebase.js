import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARjnmFRI4qONasqFtwW9tK6Zo-VlHVpok",
  authDomain: "face-attendance-aa24a.firebaseapp.com",
  projectId: "face-attendance-aa24a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
