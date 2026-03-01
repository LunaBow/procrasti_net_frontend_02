import { api } from "./API-Client.js";

const form = document.getElementById('register-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailReg').value;
    const username = document.getElementById('usernameReg').value;
    const password = document.getElementById('passwordReg').value;

    if (!username || !password || !email) {
        alert("Please fill in all fields (email, username, password)");
        return;
    }

    try {
        await api.register({ username, password, email });
        alert('Registration successful! You can now log in.');
        form.reset(); // Leert die Felder nach Erfolg
    } catch (error) {
        alert('Registration failed. This is probably Lunas Fault.');
        console.error(error);
    }
});