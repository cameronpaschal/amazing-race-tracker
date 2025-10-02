// js/app.js
// Firebase v10+ via CDN modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---- Replace with your project values ----
const firebaseConfig = {
  apiKey: "AIzaSyBMtKohcmAMQdS8knsiAXTPnL60f1-Gu5I",
  authDomain: "amazingrace-dba125.firebaseapp.com",
  projectId: "amazingrace-dba125",
  storageBucket: "amazingrace-dba125.firebasestorage.app",
  messagingSenderId: "24967511425",
  appId: "1:24967511425:web:3638cbdf8ab579c7383c80",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Shared UI helpers
export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => Array.from(document.querySelectorAll(sel));
export const fmtDate = (ts) => (ts?.toDate ? ts.toDate().toLocaleString() : "");
export const toast = (msg, ms = 2200) => {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), ms);
};
export const escapeHtml = (s = "") =>
  s.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m]
  );

// Simple auth guard used per page
export function requireAuth(onReady) {
  onAuthStateChanged(auth, (user) => {
    const emailEl = $("#userEmail");
    const signOutBtn = $("#btnSignOut");
    if (emailEl) emailEl.textContent = user ? user.email || user.uid : "";
    if (signOutBtn) {
      signOutBtn.addEventListener("click", async () => {
        await signOut(auth);
        location.href = "login.html";
      });
      signOutBtn.classList.toggle("hidden", !user);
    }
    if (!user) {
      // If not on login page, send them there
      if (!location.pathname.endsWith("login.html"))
        location.href = "login.html";
      return;
    }
    onReady?.(user);
  });
}

// Expose Firebase bits needed by other modules
export {
  auth,
  signInWithEmailAndPassword,
  db,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
};
