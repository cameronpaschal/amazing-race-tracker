// js/auth.js
import { $, toast, auth, signInWithEmailAndPassword } from './app.js';

const form = $('#loginForm');
const email = $('#loginEmail');
const pw = $('#loginPassword');
const err = $('#loginErr');

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    err.textContent = '';
    try {
        await signInWithEmailAndPassword(auth, email.value.trim(), pw.value);
        toast("Signed in");
        location.href = "clues.html";
    } catch (ex) {
        err.textContent = ex.message ? ? "Sign-in failed.";
    }
});