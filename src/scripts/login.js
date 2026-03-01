import { api } from "../../lib/api.ts";

const loginForm = document.getElementById("login-form");
const status = document.getElementById("login-status");

function setStatusText(text) {
    if (!status) return;
    status.textContent = text;
}

function ensureLogoutButton() {
    if (!status) return null;

    let btn = status.querySelector(".logout-btn");
    if (!btn) {
        btn = document.createElement("button");
        btn.className = "logout-btn";
        btn.type = "button";
        btn.textContent = "Logout";
        btn.addEventListener("click", () => {
            api.logout();
            setStatusText("Not logged in");
            window.location.reload();
        });
        status.appendChild(btn);
    }
    return btn;
}

async function updateAuthUI() {
    if (!status) return;

    const user = await api.getCurrentUser();
    if (user) {
        setStatusText(`Logged in as ${user.display_name || user.email || "User"}`);
        ensureLogoutButton();
    } else {
        setStatusText("Not logged in");
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usernameEl = document.getElementById("username");
        const passwordEl = document.getElementById("password");

        if (!usernameEl || !passwordEl) {
            setStatusText("Login UI broke.");
            return;
        }

        try {
            setStatusText("Logging in…");
            await api.login({ email: usernameEl.value.trim(), password: passwordEl.value });
            setStatusText("Login successful ✅");
            await updateAuthUI();
            loginForm.reset();
            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error);
            setStatusText("Login failed.");
        }
    });
}

updateAuthUI();