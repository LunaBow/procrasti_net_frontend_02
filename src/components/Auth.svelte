<script>
    import { api } from '../scripts/API-Client.js';
    import { onMount } from 'svelte';

    let email = "";
    let username = "";
    let displayName = "";
    let password = "";
    let isRegister = false;
    let error = "";
    let user = null;
    let loading = true;

    async function checkUser() {
        loading = true;
        try {
            user = await api.getCurrentUser();
        } catch (e) {
            user = null;
        } finally {
            loading = false;
        }
    }

    async function handleAuth() {
        error = "";
        try {
            if (isRegister) {
                await api.register({
                    email,
                    display_name: displayName || email.split("@")[0],
                    password
                });
                // After register, attempt login
                await api.login(email, password);
            } else {
                await api.login(email, password);
            }
            await checkUser();
            // Dispatch success or reload
            window.location.reload(); 
        } catch (e) {
            error = e.message;
        }
    }

    async function logout() {
        api.logout();
        await checkUser();
    }

    onMount(checkUser);
</script>

<div class="auth-panel">
    {#if loading}
        <p>Checking authentication...</p>
    {:else if user}
        <div class="user-info">
            <p>Logged in as <strong>{user.display_name || user.username || user.handle || "Anonymous"}</strong></p>
            <button on:click={logout} class="btn-logout">Log out</button>
        </div>
    {:else}
        <div class="form-container">
            <h2>{isRegister ? 'Create Account' : 'Member Login'}</h2>
            
            {#if error}
                <div class="error-box">
                    <p>{error}</p>
                </div>
            {/if}

            <form on:submit|preventDefault={handleAuth}>
                {#if isRegister}
                    <div class="field">
                        <label for="auth-displayname">Display Name</label>
                        <input id="auth-displayname" type="text" bind:value={displayName} required placeholder="Enter display name" />
                    </div>
                {/if}
                <div class="field">
                    <label for="auth-email">Email Address</label>
                    <input id="auth-email" type="email" bind:value={email} required placeholder="Enter email" />
                </div>
                <div class="field">
                    <label for="auth-password">Password</label>
                    <input id="auth-password" type="password" bind:value={password} required placeholder="Enter password" />
                </div>
                
                <button type="submit" class="submit-btn">
                    {isRegister ? 'Sign Up' : 'Log In'}
                </button>
            </form>

            <div class="toggle-mode">
                <p>
                    {isRegister ? 'Already have an account?' : 'Need an account?'}
                    <button class="link-btn" on:click={() => isRegister = !isRegister}>
                        {isRegister ? 'Log in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </div>
    {/if}
</div>

<style>
    .auth-panel {
        background: var(--surface);
        padding: 2.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border);
        max-width: 440px;
        margin: 2rem auto;
        text-align: center;
    }

    h2 {
        font-family: var(--font-heading);
        font-size: 1.75rem;
        color: var(--text);
        margin-top: 0;
        margin-bottom: 2rem;
    }

    .error-box {
        background: var(--accent);
        color: white;
        padding: 0.85rem;
        border-radius: var(--radius-md);
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
        font-weight: 500;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        text-align: left;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-left: 0.25rem;
    }

    input {
        padding: 0.8rem 1rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface-alt);
        color: var(--text);
        font-family: inherit;
        font-size: 1rem;
        transition: all 0.2s ease;
    }

    input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(74, 93, 80, 0.1);
        background: var(--surface);
    }

    .submit-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 1rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        font-size: 1.05rem;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 0.5rem;
        font-family: inherit;
    }

    .submit-btn:hover {
        background: var(--primary-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }

    .toggle-mode {
        margin-top: 2rem;
        font-size: 0.95rem;
        color: var(--text-muted);
        border-top: 1px solid var(--border);
        padding-top: 1.5rem;
    }

    .link-btn {
        background: none;
        border: none;
        color: var(--primary);
        font-weight: 700;
        cursor: pointer;
        padding: 0;
        margin-left: 0.35rem;
        transition: color 0.2s ease;
    }

    .link-btn:hover {
        color: var(--primary-hover);
        text-decoration: underline;
    }

    .user-info {
        padding: 1rem 0;
    }

    .btn-logout {
        background: var(--accent);
        color: white;
        border: none;
        padding: 0.6rem 1.25rem;
        border-radius: 999px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 1.5rem;
        transition: all 0.2s ease;
    }

    .btn-logout:hover {
        background: var(--accent-hover);
        transform: translateY(-1px);
    }
</style>
