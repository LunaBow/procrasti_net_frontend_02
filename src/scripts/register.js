import { api } from "./API-Client.js";

const form = document.getElementById('register-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailReg').value;
    const username = document.getElementById('usernameReg').value;
    const display_name = document.getElementById('display_nameReg').value;
    const password = document.getElementById('passwordReg').value;

    if (!username || !password || !email || !display_name) {
        alert("Please fill in all fields (email, username, display name, password)");
        return;
    }

    try {
        await api.register({ username, password, email, display_name, handle: username });
        alert('Registration successful! You can now log in.');
        form.reset(); // Leert die Felder nach Erfolg
    } catch (error) {
        alert('Registration failed. This is probably Lunas Fault.');
        console.error(error);
    }
});