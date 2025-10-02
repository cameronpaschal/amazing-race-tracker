// js/clues-list.js
import {
    $,
    $$,
    fmtDate,
    toast,
    escapeHtml,
    requireAuth,
    db,
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc
} from './app.js';

const qSearch = $("#qSearch");
const fStatus = $("#fStatus");
const fArea = $("#fArea");
const tbody = $("#tbody");
const count = $("#count");

requireAuth(async() => {
    // initial render
    await renderList();
    // wire filters
    qSearch.addEventListener("input", renderList);
    fStatus.addEventListener("change", renderList);
    fArea.addEventListener("change", renderList);
});

async function fetchCluesRaw() {
    const snap = await getDocs(query(collection(db, "clues"), orderBy("updatedAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function renderList() {
    const rows = await fetchCluesRaw();

    const areas = Array.from(new Set(rows.map(r => r.areaId).filter(Boolean))).sort();
    fArea.innerHTML = `<option value="">Area: All</option>` + areas.map(a => `<option value="${a}">${escapeHtml(a)}</option>`).join("");

    const q = qSearch.value.trim().toLowerCase();
    const status = fStatus.value;
    const area = fArea.value;

    const filtered = rows.filter(r => {
        const okQ = !q || (r.title || "").toLowerCase().includes(q);
        const okS = !status || r.status === status;
        const okA = !area || r.areaId === area;
        return okQ && okS && okA;
    });

    count.textContent = `${filtered.length} clue${filtered.length===1?"":"s"}`;
    tbody.innerHTML = filtered.map(r => {
        const u = r.updatedAt ? fmtDate(r.updatedAt) : "";
        return `<tr>
      <td><a href="clue-detail.html?id=${encodeURIComponent(r.id)}">${escapeHtml(r.title || "(untitled)")}</a></td>
      <td>${escapeHtml(r.areaId || "")}</td>
      <td><span class="status ${r.status}">${r.status || ""}</span></td>
      <td>${r.difficulty ?? ""}</td>
      <td class="muted">${u}</td>
      <td>
        <a href="clue-edit.html?id=${encodeURIComponent(r.id)}">Edit</a> ·
        <a href="#" data-del="${r.id}">Delete</a>
      </td>
    </tr>`;
    }).join("");

    // hook deletes
    $$('[data-del]').forEach(el => {
        el.addEventListener('click', async(e) => {
            e.preventDefault();
            const id = el.getAttribute('data-del');
            if (!confirm("Delete this clue?")) return;
            await deleteDoc(doc(db, "clues", id));
            toast("Deleted");
            renderList();
        });
    });
}