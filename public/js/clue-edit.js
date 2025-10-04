import {
  $,
  toast,
  requireAuth,
  auth,
  db,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "./app.js";

const id = new URLSearchParams(location.search).get("id");

const eHeading = $("#eHeading");
const eSave = $("#eSave");
const eDelete = $("#eDelete");
const eErr = $("#eErr");
const eId = $("#eId");
const eTitle = $("#eTitle");
const eArea = $("#eArea");
const eStatus = $("#eStatus");
const eDiff = $("#eDiff");
const eText = $("#eText");

let listenersBound = false;

requireAuth(async () => {
  if (id) {
    await loadEditor(id);
  } else {
    resetEditor();
  }

  if (!listenersBound) {
    eSave.addEventListener("click", onSave);
    eDelete.addEventListener("click", onDelete);
    listenersBound = true;
  }
});

function resetEditor() {
  eHeading.textContent = "New Clue";
  eId.value = "";
  eTitle.value = "";
  eArea.value = "";
  eStatus.value = "draft";
  eDiff.value = "1";
  eText.value = "";
  eErr.textContent = "";
  eDelete.classList.add("hidden");
}

async function loadEditor(id) {
  resetEditor();
  const snap = await getDoc(doc(db, "clues", id));
  if (!snap.exists()) {
    toast("Not found");
    location.href = "clues.html";
    return;
  }
  const c = snap.data();
  eHeading.textContent = "Edit Clue";
  eId.value = id;
  eTitle.value = c.title ?? "";
  eArea.value = c.areaId ?? "";
  eStatus.value = c.statusx ?? "draft";
  eDiff.value = String(c.difficulty ?? 1);
  eText.value = c.text ?? "";
  eDelete.classList.remove("hidden");
}

async function onSave() {
  eErr.textContent = "";

  const title = eTitle.value.trim();
  const areaId = eArea.value.trim();
  const text = eText.value.trim();
  const status = eStatus.value;
  const difficulty = Number(eDiff.value);

  if (!title || !areaId || !text) {
    eErr.textContent = "Please fill all required fields.";
    return;
  }

  const payload = {
    title,
    areaId,
    text,
    status,
    difficulty,
    updatedAt: serverTimestamp(),
    updatedBy: auth.currentUser?.uid ?? null,
  };

  try {
    if (eId.value) {
      await updateDoc(doc(db, "clues", eId.value), payload);
      toast("Saved");
      location.href = `clue-detail.html?id=${encodeURIComponent(eId.value)}`;
    } else {
      const ref = await addDoc(collection(db, "clues"), {
        ...payload,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid ?? null,
      });
      toast("Created");
      location.href = `clue-detail.html?id=${encodeURIComponent(ref.id)}`;
    }
  } catch (ex) {
    console.error(ex);
    eErr.textContent = "Save failed.";
  }
}

async function onDelete() {
  if (!eId.value) return;
  if (!confirm("Delete this clue?")) return;
  try {
    await deleteDoc(doc(db, "clues", eId.value));
    toast("Deleted");
    location.href = "clues.html";
  } catch (ex) {
    console.error(ex);
    eErr.textContent = "Delete failed.";
  }
}
