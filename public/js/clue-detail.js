// js/clue-detail.js
import {
    $,
    fmtDate,
    toast,
    escapeHtml,
    requireAuth,
    db,
    doc,
    getDoc,
    deleteDoc
} from './app.js';

const id = new URLSearchParams(location.search).get('id');

const dTitle = $("#dTitle");
const dStatus = $("#dStatus");
const dArea = $("#dArea");
const dDiff = $("#dDiff");
const dText = $("#dText");
const dMeta = $("#dMeta");
const dEdit = $("#dEdit");
const dDelete = $("#dDelete");

requireAuth(async() => {
    if (!id) { toast("Missing id");
        location.href = "clues.html"; return; }
    await renderDetail();
    dEdit.href = `clue-edit.html?id=${encodeURIComponent(id)}`;
    dDelete.addEventListener('click', onDelete);
});

async function renderDetail() {
    const snap = await getDoc(doc(db, "clues", id));
    if (!snap.exists()) { toast("Not found");
        location.href = "clues.html"; return; }
    const c = snap.data();
    dTitle.textContent = c.title || "(untitled)";
    dStatus.textContent = c.status || "";
    dStatus.className = `status ${c.status}`;
    dArea.textContent = c.areaId || "(no area)";
    dDiff.textContent = `Difficulty ${c.difficulty ?? "-"}`;
    dText.textContent = c.text || "";
    dMeta.textContent = `Updated: ${fmtDate(c.updatedAt)} • Created: ${fmtDate(c.createdAt)}`;
}

async function onDelete() {
    if (!confirm("Delete this clue?")) return;
    await deleteDoc(doc(db, "clues", id));
    toast("Deleted");
    location.href = "clues.html";
}