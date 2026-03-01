import {login} from "../../lib/auth.js";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin(e) {
    e.preventDefault();
    error = "";
    loading = true;

    try {
    await login(email.trim(), password);
    // redirect wherever
    window.location.href = "/";
} catch (err) {
    error = err.message;
} finally {
    loading = false;
}
}


