<script lang="ts">
    import { onMount } from "svelte";
    import { api } from "../../lib/api";

    // UI state
    let open: boolean = false;
    let mode: "login" | "register" = "login";

    // form state
    let email: string = "";
    let password: string = "";
    let displayName: string = "";

    let loading: boolean = false;
    let error: string = "";
    let success: string = "";

    let user: any = null;
    let isLoggedIn: boolean = false;

    function resetMsgs() {
        error = "";
        success = "";
    }

    function syncAuthState() {
        // don't trust reactivity on api.token if it's a plain property
        isLoggedIn = !!api.token;
    }

    function toggle() {
        open = !open;
        resetMsgs();
    }

    function switchMode(m: "login" | "register") {
        mode = m;
        open = true;
        resetMsgs();
    }

    async function refreshUser() {
        try {
            user = await api.getCurrentUser();
        } catch {
            user = null;
        } finally {
            syncAuthState();
        }
    }

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        resetMsgs();
        try {
            await api.login({ email: email.trim(), password });
            await refreshUser();
            success = "Logged in.";
            setTimeout(() => (open = false), 350);
        } catch (err: any) {
            error = err?.message ?? "Login failed";
        } finally {
            loading = false;
            syncAuthState();
        }
    }

    async function handleRegister(e: Event) {
        e.preventDefault();
        loading = true;
        resetMsgs();
        try {
            await api.register({
                email: email.trim(),
                password,
                display_name: displayName.trim() || email.trim().split("@")[0],
            });
            success = "Registered. Now log in.";
            mode = "login";
            open = true;
        } catch (err: any) {
            error = err?.message ?? "Register failed";
        } finally {
            loading = false;
        }
    }

    function logout() {
        api.logout();
        user = null;
        open = false;
        resetMsgs();
        syncAuthState();
    }

    onMount(async () => {
        await refreshUser();
    });
</script>

<div class="authWrap" class:open>
    <div class="auth-trigger-pill">
        <button
                type="button"
                class="auth-toggle"
                on:click={toggle}
                aria-expanded={open}
                aria-controls="auth-panel"
        >
            <div class="auth-left">
        <span class="auth-title">
          {#if isLoggedIn}
            Logged in{#if user?.display_name} as {user.display_name}{/if}
          {:else}
            Member Access
          {/if}
        </span>

                <span class="auth-sub">
          {#if isLoggedIn}
            {open ? "Tap to close" : "Logout is here."}
          {:else}
            {open ? "Tap to close" : "Log in or sign up"}
          {/if}
        </span>
            </div>
        </button>

        <div class="auth-right">
            {#if isLoggedIn}
                <button type="button" class="ghost" on:click={logout}>Logout</button>
            {:else}
                <button type="button" class="ghost" on:click={() => switchMode("login")}>Log in</button>
                <button type="button" class="ghost" on:click={() => switchMode("register")}>Sign up</button>
            {/if}
        </div>
    </div>

    <div class="panel" id="auth-panel" aria-hidden={!open}>
        {#if open}
            {#if isLoggedIn}
                <div class="logged">
                    <p>You’re logged in. Only thing left is to log out or close this. ✨</p>
                </div>
            {:else}
                <form class="form" on:submit={mode === "login" ? handleLogin : handleRegister}>
                    <h3>{mode === "login" ? "Login" : "Register"}</h3>

                    {#if mode === "register"}
                        <input
                                type="text"
                                placeholder="Display name"
                                bind:value={displayName}
                                autocomplete="nickname"
                        />
                    {/if}

                    <input type="email" placeholder="Email" bind:value={email} required autocomplete="email" />
                    <input
                            type="password"
                            placeholder="Password"
                            bind:value={password}
                            required
                            autocomplete={mode === "login" ? "current-password" : "new-password"}
                    />

                    <button class="primary" type="submit" disabled={loading}>
                        {loading ? "Working..." : mode === "login" ? "Login" : "Create account"}
                    </button>

                    {#if error}<p class="msg error">{error}</p>{/if}
                    {#if success}<p class="msg ok">{success}</p>{/if}
                </form>
            {/if}
        {/if}
    </div>
</div>

<style>
    .authWrap {
        width: min(560px, 100%);
        margin: 0 auto;
        border-radius: 999px;
        overflow: hidden;
        border: 1px solid var(--border, rgba(0,0,0,0.12));
        background: var(--surface, rgba(255,255,255,0.9));
        backdrop-filter: blur(6px);
        max-height: 56px;
        transition: max-height 260ms ease, border-radius 260ms ease, box-shadow 260ms ease, transform 260ms ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .authWrap:hover {
        box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        transform: translateY(-1px);
    }

    .authWrap.open {
        border-radius: 18px;
        max-height: 420px;
        box-shadow: 0 14px 40px rgba(0,0,0,0.14);
        transform: none;
    }

    .auth-trigger-pill {
        height: 56px;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 0 14px;
        gap: 12px;
    }

    .auth-toggle {
        flex: 1;
        display: flex;
        align-items: center;
        background: transparent;
        border: 0;
        padding: 0;
        cursor: pointer;
        text-align: left;
        min-width: 0;
    }

    .auth-toggle:focus {
        outline: 2px solid rgba(0,0,0,0.2);
        outline-offset: 2px;
        border-radius: 12px;
    }

    .auth-left {
        display: flex;
        flex-direction: column;
        line-height: 1.05;
        min-width: 0;
    }

    .auth-title {
        font-weight: 800;
        font-size: 0.98rem;
        color: var(--text, #222);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .auth-sub {
        font-size: 0.8rem;
        opacity: 0.75;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .auth-right {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
    }

    .ghost {
        border: 1px solid var(--border, rgba(0,0,0,0.12));
        background: transparent;
        padding: 6px 10px;
        border-radius: 999px;
        cursor: pointer;
        font-weight: 700;
        font-size: 0.82rem;
    }

    .panel {
        padding: 12px 14px 14px;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .form h3 {
        margin: 6px 0 2px;
        font-size: 1rem;
    }

    .form input {
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border, rgba(0,0,0,0.12));
        background: var(--surface-alt, rgba(255,255,255,0.65));
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form input:focus {
        outline: none;
        border-color: var(--primary, #2563eb);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary, #2563eb) 20%, transparent);
    }

    .primary {
        padding: 10px 12px;
        border-radius: 12px;
        border: 0;
        font-weight: 800;
        cursor: pointer;
        background: var(--primary, #2563eb);
        color: white;
        transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .primary:hover:not(:disabled) {
        background: var(--primary-hover, #1d4ed8);
        transform: translateY(-1px);
    }

    .msg {
        margin: 0;
        font-size: 0.9rem;
    }

    .msg.error { color: #dc2626; }
    .msg.ok { color: #16a34a; }

    .logged {
        padding: 8px 2px;
        opacity: 0.9;
    }
</style>