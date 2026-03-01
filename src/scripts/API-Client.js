
class APIClient {
    constructor() {
        // Astro client-side env vars must start with PUBLIC_
        const envBase = (import.meta.env.PUBLIC_API_URL || "").trim();
        this.baseUrl = (envBase || "https://mt231043-10992.node.ustp.cloud/api").replace(/\/$/, "");
        // WebSocket URL might need adjustment on CampusCloud if port 10992 isn't exposed for wss
        this.wsUrl = (import.meta.env.PUBLIC_WS_URL || "wss://mt231043-10992.node.ustp.cloud:10992");
    }

    get token() {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("jwt");
    }

    set token(v) {
        if (typeof window === "undefined") return;
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
        const publicPaths = ["/skills", "/user", "/book", "/artwork", "/av"];
        const basePath = path.split("?")[0];
        const isPublic = publicPaths.some(p => basePath === p || basePath.startsWith(p + "/"));
        const isAuth = basePath.startsWith("/auth/");

        if (!this.token && !isAuth && !isPublic) {
            throw new Error(`Unauthorized: No token for ${method} ${path}`);
        }

        const res = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: this.headers({ isFormData }),
            body,
        });

        if (res.status === 401) {
            // Token is invalid/expired
            this.token = null;
        }

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`${method} ${path} -> ${res.status} ${res.statusText} ${text}`);
        }

        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) return res.json();
        return res.text();
    }

    /* ===== AUTH (JWT) ===== */
    async login(email, password) {
        const data = await this.req("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (data?.token) this.token = data.token;
        return data;
    }

    async register({ email, password, display_name }) {
        return this.req("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                display_name: display_name || email.split("@")[0],
            }),
        });
    }

    logout() {
        this.token = null;
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    }

    get isDevMode() {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("devMode") === "true";
    }

    async getCurrentUser() {
        if (this.isDevMode) {
            return { username: "DevUser", profileDescription: "Developer", devMode: true };
        }
        if (!this.token) return null;
        try {
            return await this.req("/auth/me");
        } catch {
            return null;
        }
    }

    /* ===== OLD CONTENT (Andrea&Luna) ===== */
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

    /* ===== PROCRASTI-NET ENDPOINTS =====
       Leave these here so your frontend can start now.
    */
    listSkills(q = "") {
        const qs = q ? `?q=${encodeURIComponent(q)}` : "";
        return this.req(`/skills${qs}`);
    }

    listTodos() {
        return this.req("/todos");
    }

    createTodo(data) {
        return this.req("/todos", { method: "POST", body: JSON.stringify(data) });
    }

    updateTodo(id, data) {
        return this.req(`/todos/${id}`, { method: "PUT", body: JSON.stringify(data) });
    }

    deleteTodo(id) {
        return this.req(`/todos/${id}`, { method: "DELETE" });
    }

    listHabits() {
        return this.req("/routines");
    }

    createHabit(data) {
        return this.req("/routines", { method: "POST", body: JSON.stringify(data) });
    }

    checkHabit(id, dateISO, done = true, note = "") {
        return this.req(`/routines/${id}/complete`, {
            method: "POST",
            body: JSON.stringify({ date: dateISO, done, note }),
        });
    }

    listPlan(_fromISO, _toISO) {
        // Planner will now just use listTodos and handle dates
        console.warn("listPlan endpoint not implemented in backend. Redirecting to listTodos.");
        return this.listTodos();
    }

    scheduleTodo(todoId, startsAtISO, _endsAtISO) {
        // Just patch the due_date
        return this.updateTodo(todoId, { due_date: startsAtISO });
    }

    listCheckins(from, to) {
        let qs = "";
        if (from || to) {
            const params = new URLSearchParams();
            if (from) params.append("from", from);
            if (to) params.append("to", to);
            qs = `?${params.toString()}`;
        }
        return this.req(`/checkins${qs}`);
    }

    createCheckin(data) {
        return this.req("/checkins", { method: "POST", body: JSON.stringify(data) });
    }

    deleteCheckin(id) {
        return this.req(`/checkins/${id}`, { method: "DELETE" });
    }

    getSettings() {
        return Promise.resolve({ error: "Not implemented in backend" });
    }

    updateSettings(_data) {
        return Promise.resolve({ error: "Not implemented in backend" });
    }
}

export const api = new APIClient();