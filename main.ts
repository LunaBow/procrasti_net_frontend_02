// src/main.ts
import { api } from "./scripts/API-Client"; // adjust path if yours differs

function $(id: string) {
    return document.getElementById(id);
}

function show(panelId: string, panels: string[]) {
    for (const p of panels) {
        const el = $(p);
        if (el) el.style.display = p === panelId ? "block" : "none";
    }
}

/* ===== Theme toggle ===== */
function setupThemeToggle() {
    const toggle = $("theme-toggle") as HTMLInputElement | null;
    if (!toggle) return;

    // restore saved preference
    const saved = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("pastel-mode", saved === "dark");
    toggle.checked = saved === "dark";

    toggle.addEventListener("change", () => {
        const dark = toggle.checked;
        document.body.classList.toggle("pastel-mode", dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    });
}

/* ===== Auth UI ===== */
async function setupAuthUI() {
    const loginForm = $("login-form") as HTMLFormElement | null;
    const registerForm = $("register-form") as HTMLFormElement | null;
    const status = $("login-status");

    async function refresh() {
        if (!status) return;

        try {
            const user = await api.getCurrentUser();
            if (user?.username) {
                status.textContent = `Logged in as ${user.username}`;
            } else {
                status.textContent = "Not logged in";
            }
        } catch {
            status.textContent = "Not logged in";
        }
    }

    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const u = ($("username") as HTMLInputElement | null)?.value ?? "";
        const p = ($("password") as HTMLInputElement | null)?.value ?? "";

        try {
            await api.login(u, p);
            await refresh();
            loginForm.reset();
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    });

    registerForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const u = ($("usernameReg") as HTMLInputElement | null)?.value ?? "";
        const p = ($("passwordReg") as HTMLInputElement | null)?.value ?? "";

        try {
            await api.register(u, p);
            alert("Registered. Now log in.");
            registerForm.reset();
        } catch (err) {
            console.error(err);
            alert("Registration failed");
        }
    });

    // optional logout button if you have one
    $("logout-btn")?.addEventListener("click", () => api.logout());

    await refresh();
}

/* ===== App navigation (panels) ===== */
function setupNavigation() {
    const mapping: Array<[string, string]> = [
        ["triggerSkills", "SkillsVisible"],
        ["triggerTodos", "TodosVisible"],
        ["triggerHabits", "HabitsVisible"],
        ["triggerPlanner", "PlannerVisible"],
        ["triggerCalendar", "CalendarVisible"],
        ["triggerSettings", "SettingsVisible"],
    ];

    const panels = mapping.map(([, panel]) => panel);

    for (const [btnId, panelId] of mapping) {
        $(btnId)?.addEventListener("click", () => show(panelId, panels));
    }
}

/* ===== Boot ===== */
document.addEventListener("DOMContentLoaded", () => {
    setupThemeToggle();
    setupNavigation();
    setupAuthUI().catch(console.error);
});