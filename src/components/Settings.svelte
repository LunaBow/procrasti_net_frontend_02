<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import Auth from './Auth.svelte';

    let loading = true;
    let user = null;

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

    onMount(checkUser);
</script>

<section class="panel">
    <h2>Account & Settings</h2>

    <div class="not-implemented">
        <p><strong>Note:</strong> Advanced settings (excluded triggers, themes, etc.) are currently <em>not implemented</em> on the backend.</p>
    </div>

    {#if loading}
        <p>Checking authentication...</p>
    {:else}
        <Auth />
    {/if}
</section>

<style>
    .panel {
        padding: 2rem;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        max-width: 600px;
        margin: 0 auto;
    }
    h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #1e293b;
        text-align: center;
    }
    .not-implemented {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #92400e;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        font-size: 0.9rem;
        text-align: center;
    }
</style>
