import { api } from "./API-Client.js";

const list = document.getElementById("skillList");
const search = document.getElementById("skillSearch");
const cat = document.getElementById("skillCategory");

async function loadCategories() {
    const cats = await api.listCategories();
    cat.innerHTML = `<option value="">All categories</option>` + cats.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
}

function card(s) {
    return `
  <article class="card">
    <h3>${s.name}</h3>
    <p class="muted">${s.description || ""}</p>
    <div class="tags">
      <span class="tag">${s.difficulty_level ?? "?"}/5</span>
      <span class="tag">${s.energy_required ?? "?"}</span>
      <span class="tag">${s.evidence_level ?? "?"}</span>
    </div>
  </article>`;
}

async function loadSkills() {
    const q = search?.value?.trim() || "";
    const skills = await api.listSkills(q);
    const categoryId = cat?.value;
    const filtered = categoryId ? skills.filter(s => String(s.category_id) === String(categoryId)) : skills;
    list.innerHTML = filtered.map(card).join("");
}

search?.addEventListener("input", () => loadSkills());
cat?.addEventListener("change", () => loadSkills());

(async () => {
    if (!list) return;
    await loadCategories();
    await loadSkills();
})();