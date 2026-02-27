import { api } from "./API-Client.js";

const loginForm = document.getElementById('login-form');
const status = document.getElementById('login-status');
const registerBar = document.getElementById('register-bar');

async function updateAuthUI() {
    try {
        const user = await api.getCurrentUser();
        if (user && user.username) {
            // Login & Register ausblenden
            if (loginForm) loginForm.style.display = 'none';
            if (registerBar) registerBar.style.display = 'none';

            // Willkommenstext + Logout Button
            status.innerHTML = `Welcome, ${user.username} `;

            // Button dynamisch erstellen
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = "Logout";
            logoutBtn.className = "logout-btn"; // Für CSS Styling
            logoutBtn.onclick = () => api.logout();

            status.appendChild(logoutBtn);
        } else {
            status.textContent = "No member logged in";
            if (loginForm) loginForm.style.display = 'block';
            if (registerBar) registerBar.style.display = 'block';
        }
    } catch (error) {
        console.error("Auth check failed:", error);
    }
}

// Event Listener
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // IDs müssen exakt mit HTML übereinstimmen!
        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');

        if (!usernameEl || !passwordEl) {
            console.error("Input fields not found!");
            return;
        }

        try {
            await api.login(usernameEl.value, passwordEl.value);
            alert("Login successful");
            updateAuthUI(); // UI sofort aktualisieren ohne Refresh
            loginForm.reset();
        } catch (error) {
            alert("Login failed!");
            console.error(error);
        }
    });
}

// Initialer Check
updateAuthUI();