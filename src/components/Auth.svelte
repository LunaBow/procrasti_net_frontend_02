<script lang="ts">
    import { api } from "../../lib/api";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin(e: Event) {
        e.preventDefault();
        error = "";
        loading = true;

        try {
            await api.login({ email: email.trim(), password });
            window.location.href = "/"; // or wherever
        } catch (err: any) {
            error = err?.message ?? "Login failed";
        } finally {
            loading = false;
        }
    }
</script>

<form on:submit={handleLogin}>
    <input type="email" bind:value={email} required />
    <input type="password" bind:value={password} required />

    <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
    </button>

    {#if error}
        <p class="error">{error}</p>
    {/if}
</form>