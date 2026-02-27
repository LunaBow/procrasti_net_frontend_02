import { api } from "./API-Client.js";

const form = document.getElementById('register-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('usernameReg').value;
    const password = document.getElementById('passwordReg').value;

    if (!username || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        await api.register(username, password);
        alert('Registration successful! You can now log in.');
        form.reset(); // Leert die Felder nach Erfolg
    } catch (error) {
        alert('Registration failed. Username might already be taken.');
        console.error(error);
    }
});