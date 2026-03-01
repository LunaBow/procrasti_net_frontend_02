<script lang="ts">
    import { onMount } from "svelte";
    import { api } from "../../lib/api"; // src/components/Auth.svelte -> src/lib/api.ts

    // UI state
    let open = false;
    let mode: "login" | "register" = "login";

    // form state
    let email = "";
    let password = "";
    let displayName = "";

    let loading = false;
    let error = "";
    let success = "";

    // optional: show who is logged in
    let user: any = null;

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

    async function refreshUser() {
        user = await api.getCurrentUser();
    }

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        error = "";
        success = "";
        try {
            await api.login({ email: email.trim(), password });
            await refreshUser();
            success = "Logged in.";
            // close after a beat so you see it worked
            setTimeout(() => {
                open = false;
            }, 350);
        } catch (err: any) {
            error = err?.message ?? "Login failed";
        } finally {
            loading = false;
        }
    }

    async function handleRegister(e: Event) {
        e.preventDefault();
        loading = true;
        error = "";
        success = "";
        try {
            await api.register({
                email: email.trim(),
                password,
                display_name: displayName.trim() || email.trim().split("@")[0],
            });
            await refreshUser();
            success = "Registered.";
            // stay open but flip to login for clarity
            mode = "login";
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
        error = "";
        success = "";
    }

    onMount(async () => {
        await refreshUser();
    });
</script>

<!--
  This is intentionally SMALL by default.
  It only grows when `open === true`.
-->
<div class="authWrap" class:open>
    <!-- pill header (NOT a button, so we can safely have buttons inside) -->
    <div
            class="pill"
            role="button"
            tabindex="0"
            on:click={toggle}
            on:keydown={(e) => (e.key === "Enter" || e.key === " ") && toggle()}
    >
        <div class="pillLeft">
      <span class="pillTitle">
        {#if api.token}
          Logged in{#if user?.display_name} as {user.display_name}{/if}
        {:else}
          Member Access
        {/if}
      </span>
            <span class="pillSub">
        {open ? "Tap to close" : api.token ? "You’re good." : "Log in or sign up"}
      </span>
        </div>

        <div class="pillRight" on:click|stopPropagation>
            {#if api.token}
                <button type="button" class="ghost" on:click={logout}>Logout</button>
            {:else}
                <button type="button" class="ghost" on:click={() => switchMode("login")}>Log in</button>
                <button type="button" class="ghost" on:click={() => switchMode("register")}>Sign up</button>
            {/if}
        </div>
    </div>

    <!-- expanding panel -->
    <div class="panel" aria-hidden={!open}>
        {#if open}
            {#if api.token}
                <div class="logged">
                    <p>You’re logged in. Go be productive or whatever. 🧃</p>
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
                        {#if loading}
                            Working...
                        {:else}
                            {mode === "login" ? "Login" : "Create account"}
                        {/if}
                    </button>

                    {#if error}<p class="msg error">{error}</p>{/if}
                    {#if success}<p class="msg ok">{success}</p>{/if}
                </form>
            {/if}
        {/if}
    </div>
</div>

<style>
    /* small by default */
    .authWrap {
        width: min(560px, 100%);
        margin: 0 auto;
        border-radius: 999px;
        overflow: hidden;
        border: 1px solid var(--border, rgba(0,0,0,0.12));
        background: var(--surface, rgba(255,255,255,0.9));
        backdrop-filter: blur(6px);
        max-height: 56px;
        transition: max-height 260ms ease, border-radius 260ms ease, box-shadow 260ms ease;
    }

    .authWrap.open {
        border-radius: 18px;
        max-height: 420px;
        box-shadow: 0 14px 40px rgba(0,0,0,0.14);
    }

    .pill {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        cursor: pointer;
        user-select: none;
        gap: 12px;
    }

    .pillLeft {
        display: flex;
        flex-direction: column;
        line-height: 1.05;
        min-width: 0;
    }

    .pillTitle {
        font-weight: 800;
        font-size: 0.98rem;
        color: var(--text, #222);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pillSub {
        font-size: 0.8rem;
        opacity: 0.75;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pillRight {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
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
    }

    .primary {
        padding: 10px 12px;
        border-radius: 12px;
        border: 0;
        font-weight: 800;
        cursor: pointer;
        background: var(--primary, #2563eb);
        color: white;
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