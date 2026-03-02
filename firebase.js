import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJHrIvg_X4cyUlgzIq0HtACHfx7xoohvk",
  authDomain: "student-fe723.firebaseapp.com",
  projectId: "student-fe723",
  storageBucket: "student-fe723.firebasestorage.app",
  messagingSenderId: "716993183092",
  appId: "1:716993183092:web:e8e99d8b66b91a6e430021",
  measurementId: "G-BEQ2VGHX03"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
