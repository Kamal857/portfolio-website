import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQH_SQT0h_JE0v-g7UxtjRb9pNFWdHsj0",
  authDomain: "portfolio-6ce7b.firebaseapp.com",
  projectId: "portfolio-6ce7b",
  storageBucket: "portfolio-6ce7b.firebasestorage.app",
  messagingSenderId: "457394976264",
  appId: "1:457394976264:web:5edd6946541761075e03bd",
  measurementId: "G-BPXDEWGXTR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

window.firebaseApp = app;
window.firebaseAnalytics = analytics;

console.log("Firebase initialized", app);