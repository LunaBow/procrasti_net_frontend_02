<script lang="ts">
    import { api } from "../../lib/api";

    let open = false;
    let mode: "login" | "register" = "login";

    let email = "";
    let password = "";
    let displayName = "";
    let error = "";
    let loading = false;
    let success = "";

    function toggle() {
        open = !open;
        error = "";
        success = "";
    }

    function switchMode(m: "login" | "register") {
        mode = m;
        open = true;
        error = "";
        success = "";
    }

    async function handleLogin(e: Event) {
        e.preventDefault();
        error = "";
        success = "";
        loading = true;

        try {
            await api.login({ email: email.trim(), password });
            success = "Logged in!";
            setTimeout(() => {
                open = false;
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            error = err?.message ?? "Login failed";
        } finally {
            loading = false;
        }
    }

    async function handleRegister(e: Event) {
        e.preventDefault();
        error = "";
        success = "";
        loading = true;

        try {
            await api.register({
                email: email.trim(),
                password,
                display_name: displayName.trim() || "User"
            });
            success = "Registered! Now log in.";
            mode = "login";
        } catch (err: any) {
            error = err?.message ?? "Register failed";
        } finally {
            loading = false;
        }
    }
</script>

<div id="AuthVisible" class:open>
    <button type="button" class="pill" on:click={toggle}>
        <span>{open ? "Close" : (api.token ? "Logged In" : "Member Access")}</span>

        {#if !api.token}
        <span class="pill-actions">
            <button on:click|stopPropagation={() => switchMode("login")} type="button">
                Log in
            </button>
            <button type="button" on:click|stopPropagation={() => switchMode("register")}>
                Register
            </button>
        </span>
        {/if}
    </button>

    <div class="auth-panel">
        <div class="auth-panel-inner">
            {#if open}
                {#if api.token}
                    <div class="logged-in-view">
                        <p>You are currently logged in.</p>
                        <button type="button" on:click={() => { api.logout(); window.location.reload(); }}>Logout</button>
                    </div>
                {:else}
                    <form on:submit={mode === 'login' ? handleLogin : handleRegister} class="form">
                        <h3>{mode === 'login' ? 'Login' : 'Register'}</h3>
                        
                        {#if mode === 'register'}
                            <input type="text" placeholder="Display name" bind:value={displayName} />
                        {/if}
                        
                        <input type="email" placeholder="Email" bind:value={email} required />
                        <input type="password" placeholder="Password" bind:value={password} required />

                        <button type="submit" disabled={loading}>
                            {loading ? (mode === 'login' ? "Logging in..." : "Creating...") : (mode === 'login' ? "Login" : "Register")}
                        </button>

                        {#if error}
                            <p class="error">{error}</p>
                        {/if}
                        {#if success}
                            <p class="success">{success}</p>
                        {/if}
                    </form>
                {/if}
            {/if}
        </div>
    </div>
</div>

<style>
    #AuthVisible {
        width: 100%;
        max-width: 480px;
        border-radius: 999px;
        overflow: hidden;
        max-height: 56px;
        transition: all 280ms ease;
        background: white;
        border: 1px solid var(--border, #ddd);
        margin: 0 auto;
    }

    #AuthVisible.open {
        border-radius: 20px;
        max-height: 520px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    }

    .pill {
        width: 100%;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem;
        border: 0;
        background: transparent;
        cursor: pointer;
        font-weight: 700;
        color: inherit;
    }

    .pill-actions {
        display: flex;
        gap: 8px;
    }

    .pill-actions button {
        border: 0;
        background: var(--surface-alt, #f0f0f0);
        padding: 4px 12px;
        border-radius: 999px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.2s;
        color: var(--text, #333);
    }

    .pill-actions button:hover {
        background: var(--border, #ddd);
    }

    .auth-panel {
        padding: 1rem 1.5rem 1.5rem;
    }

    .auth-panel-inner {
        opacity: 0;
        transform: translateY(-10px);
        transition: all 200ms ease;
    }

    #AuthVisible.open .auth-panel-inner {
        opacity: 1;
        transform: translateY(0);
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .form h3 {
        margin: 0 0 0.5rem;
    }

    .form input {
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid var(--border, #ddd);
    }

    .form button[type="submit"] {
        padding: 10px;
        border-radius: 8px;
        border: 0;
        background: var(--primary, #2563eb);
        color: white;
        font-weight: 700;
        cursor: pointer;
    }

    .error { color: #dc2626; font-size: 0.9rem; margin: 0; }
    .success { color: #16a34a; font-size: 0.9rem; margin: 0; }
    
    .logged-in-view {
        text-align: center;
        padding: 1rem;
    }
    
    .logged-in-view button {
        margin-top: 1rem;
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
    }
</style>