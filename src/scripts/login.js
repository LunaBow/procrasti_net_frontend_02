import { api } from "./API-Client.js";

const loginForm = document.getElementById("login-form");
const status = document.getElementById("login-status");
const registerBar = document.getElementById("register-bar");

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
        btn.textContent = "Log out";
        status.appendChild(document.createTextNode(" "));
        status.appendChild(btn);
    }
    return btn;
}

async function updateAuthUI() {
    try {
        const user = await api.getCurrentUser();

        if (user?.username) {
            if (loginForm) loginForm.style.display = "none";
            if (registerBar) registerBar.style.display = "none";

            // Clear and rebuild status safely
            status.replaceChildren();
            status.appendChild(document.createTextNode(`Welcome, ${user.username}. Still alive. `));

            const logoutBtn = ensureLogoutButton();
            if (logoutBtn) {
                logoutBtn.onclick = async () => {
                    try {
                        await api.logout();
                        setStatusText("Logged out. Go touch grass. Or don’t. 🌱");
                        if (loginForm) loginForm.style.display = "block";
                        if (registerBar) registerBar.style.display = "block";
                    } catch (err) {
                        console.error("Logout failed:", err);
                        setStatusText("Logout failed. The system is clingy.");
                    }
                };
            }
        } else {
            setStatusText("No member logged in (yet).");
            if (loginForm) loginForm.style.display = "block";
            if (registerBar) registerBar.style.display = "block";
        }
    } catch (error) {
        console.error("Auth check failed:", error);
        setStatusText("Auth check failed. Reality is unstable.");
        if (loginForm) loginForm.style.display = "block";
        if (registerBar) registerBar.style.display = "block";
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usernameEl = document.getElementById("username");
        const passwordEl = document.getElementById("password");

        if (!usernameEl || !passwordEl) {
            console.error("Input fields not found!");
            setStatusText("Login UI broke. Someone angered the DOM gods.");
            return;
        }

        try {
            setStatusText("Logging in… doing the thing…");
            await api.login(usernameEl.value.trim(), passwordEl.value);
            setStatusText("Login successful. Congratulations on having credentials. ✅");
            await updateAuthUI();
            loginForm.reset();
        } catch (error) {
            console.error("Login failed:", error);
            setStatusText("Login failed. Skill issue (probably the password).");
        }
    });
}

updateAuthUI();