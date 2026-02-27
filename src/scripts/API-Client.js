// src/scripts/API-Client.js  (or /public/scripts/API-Client.js depending on your setup)

class APIClient {
    constructor() {
        // Astro client-side env vars must start with PUBLIC_
        const envBase = (import.meta?.env?.PUBLIC_API_URL || "").trim();
        this.baseUrl = (envBase || "https://mt231043-10992.node.ustp.cloud").replace(/\/$/, "");
    }

    get token() {
        return localStorage.getItem("jwt");
    }

    set token(v) {
        if (!v) localStorage.removeItem("jwt");
        else localStorage.setItem("jwt", v);
    }

    headers({ isFormData = false } = {}) {
        const h = {};
        if (this.token) h["Authorization"] = `Bearer ${this.token}`;
        if (!isFormData) h["Content-Type"] = "application/json";
        return h;
    }

    async req(path, { method = "GET", body, isFormData = false } = {}) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: this.headers({ isFormData }),
            body,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`${method} ${path} -> ${res.status} ${res.statusText} ${text}`);
        }

        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) return res.json();
        return res.text();
    }

    /* ===== AUTH (JWT) ===== */
    async login(username, password) {
        const data = await this.req("/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });

        if (data?.token) this.token = data.token;
        return data;
    }

    async register(username, password) {
        // existing API from your friend project
        return this.req("/user", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                profileDescription: "member",
            }),
        });
    }

    logout() {
        this.token = null;
        // Don't force reload if you don't want, but it's fine for now
        window.location.reload();
    }

    async getCurrentUser() {
        try {
            return await this.req("/me");
        } catch {
            return null;
        }
    }

    /* ===== OLD CONTENT ENDPOINTS (from friend project) ===== */
    uploadBook(data) {
        return this.req("/book", { method: "POST", body: JSON.stringify(data) });
    }

    async uploadDrawing(data, file) {
        const artwork = await this.req("/artwork", { method: "POST", body: JSON.stringify(data) });

        if (file && artwork?.artworkId) {
            const formData = new FormData();
            formData.append("image", file);

            await this.req(`/artwork/${artwork.artworkId}/image`, {
                method: "POST",
                body: formData,
                isFormData: true,
            });
        }
        return artwork;
    }

    uploadAV(data) {
        return this.req("/av", { method: "POST", body: JSON.stringify(data) });
    }

    async getAllUsers() {
        try {
            return await this.req("/user");
        } catch (e) {
            console.error("getAllUsers failed:", e);
            return [];
        }
    }

    async getBooks() {
        try {
            return await this.req("/book");
        } catch {
            return [];
        }
    }

    async getArtworks() {
        try {
            return await this.req("/artwork");
        } catch {
            return [];
        }
    }

    async getAVs() {
        try {
            return await this.req("/av");
        } catch {
            return [];
        }
    }

    /* ===== PROCRASTI-NET ENDPOINTS (implement backend later) =====
       Leave these here so your frontend can start now.
    */
    listSkills(q = "") {
        const qs = q ? `?q=${encodeURIComponent(q)}` : "";
        return this.req(`/skills${qs}`);
    }

    listCategories() {
        return this.req("/categories");
    }

    listTodos() {
        return this.req("/todos");
    }

    createTodo(data) {
        return this.req("/todos", { method: "POST", body: JSON.stringify(data) });
    }

    updateTodo(id, data) {
        return this.req(`/todos/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    }

    deleteTodo(id) {
        return this.req(`/todos/${id}`, { method: "DELETE" });
    }

    listHabits() {
        return this.req("/habits");
    }

    createHabit(data) {
        return this.req("/habits", { method: "POST", body: JSON.stringify(data) });
    }

    checkHabit(id, dateISO) {
        return this.req(`/habits/${id}/check`, {
            method: "POST",
            body: JSON.stringify({ date: dateISO }),
        });
    }

    listPlan(fromISO, toISO) {
        return this.req(`/plan?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`);
    }

    scheduleTodo(todoId, startsAtISO, endsAtISO) {
        return this.req("/plan", {
            method: "POST",
            body: JSON.stringify({ todoId, startsAt: startsAtISO, endsAt: endsAtISO }),
        });
    }

    getSettings() {
        return this.req("/settings");
    }

    updateSettings(data) {
        return this.req("/settings", { method: "PATCH", body: JSON.stringify(data) });
    }
}

export const api = new APIClient();