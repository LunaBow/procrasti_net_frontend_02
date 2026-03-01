<script>
    import { api } from '../scripts/API-Client.js';
    import { onMount } from 'svelte';

    let email = "";
    let username = "";
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
                await api.register({ username, password, email });
                // After register, attempt login
                await api.login(username, password);
            } else {
                await api.login(username, password);
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
            <p>Logged in as <strong>{user.username}</strong></p>
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
                        <label for="auth-email">Email Address</label>
                        <input id="auth-email" type="email" bind:value={email} required placeholder="Enter email" />
                    </div>
                {/if}
                <div class="field">
                    <label for="auth-username">Username</label>
                    <input id="auth-username" type="text" bind:value={username} required placeholder="Enter username" />
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
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        max-width: 400px;
        margin: 2rem auto;
        text-align: center;
    }

    h2 {
        margin-top: 0;
        color: #1e293b;
        margin-bottom: 1.5rem;
    }

    .error-box {
        background: #fee2e2;
        color: #ef4444;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        text-align: left;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #64748b;
    }

    input {
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .submit-btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
        margin-top: 0.5rem;
    }

    .submit-btn:hover {
        background: #2563eb;
    }

    .toggle-mode {
        margin-top: 1.5rem;
        font-size: 0.875rem;
        color: #64748b;
    }

    .link-btn {
        background: none;
        border: none;
        color: #3b82f6;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        margin-left: 0.25rem;
    }

    .link-btn:hover {
        text-decoration: underline;
    }

    .user-info {
        padding: 1rem 0;
    }

    .btn-logout {
        background: #f1f5f9;
        color: #475569;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
    }

    .btn-logout:hover {
        background: #e2e8f0;
    }
</style>
