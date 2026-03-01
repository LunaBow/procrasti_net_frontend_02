<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import Auth from './Auth.svelte';

    let selectedDate = new Date().toISOString().slice(0, 10);
    let planItems = [];
    let loading = true;
    let user = null;

    function isoDayRange(d) {
        // Simple mock for local time vs UTC if needed, but keeping it simple as per original
        const from = `${d}T00:00:00.000Z`;
        const to = `${d}T23:59:59.999Z`;
        return { from, to };
    }

    async function loadPlan() {
        if (!selectedDate) return;
        loading = true;
        try {
            user = await api.getCurrentUser();
            if (user) {
                const allTodos = await api.listTodos();
                // Map todos to plan items, filtering by due_date
                planItems = allTodos
                    .filter(todo => todo.due_date && todo.due_date.startsWith(selectedDate))
                    .map(todo => ({
                        ...todo,
                        startsAt: todo.due_date // for the UI
                    }));
            }
        } catch (e) {
            console.error("Failed to load plan:", e);
        } finally {
            loading = false;
        }
    }

    function formatTime(isoString) {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    onMount(loadPlan);
</script>

<section class="panel">
    <h2>Daily Planner</h2>

    <div class="controls">
        <input type="date" bind:value={selectedDate} on:change={loadPlan} />
        <button on:click={loadPlan} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Plan'}
        </button>
    </div>

    {#if loading}
        <div class="loading-state">Updating your schedule...</div>
    {:else if !user}
        <div class="auth-wrapper">
            <p>Please log in to use this feature.</p>
            <Auth />
        </div>
    {:else}
        <div class="plan-list">
            {#each planItems as item}
                <div class="plan-item">
                    <div class="time">{formatTime(item.startsAt)}</div>
                    <div class="details">
                        <span class="title">{item.title || 'Untitled Task'}</span>
                        {#if item.category}
                            <span class="category-tag">{item.category}</span>
                        {/if}
                    </div>
                </div>
            {:else}
                <div class="empty-state">
                    <p>No tasks scheduled for this day.</p>
                    <button class="ghost-btn">Add something to your plan</button>
                </div>
            {/each}
        </div>
    {/if}
</section>

<style>
    .panel {
        padding: 1.5rem;
        background: #fefce8;
        border-radius: 12px;
        border: 1px solid #fef08a;
    }
    h2 {
        margin-top: 0;
        color: #854d0e;
    }
    .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    input[type="date"] {
        padding: 0.5rem;
        border: 1px solid #eab308;
        border-radius: 6px;
    }
    button {
        padding: 0.5rem 1rem;
        background: #eab308;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
    }
    button:disabled {
        background: #fde68a;
        cursor: not-allowed;
    }
    .plan-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .plan-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        gap: 1.5rem;
    }
    .time {
        font-weight: bold;
        color: #eab308;
        min-width: 60px;
    }
    .details {
        display: flex;
        flex-direction: column;
    }
    .title {
        font-weight: 500;
        color: #334155;
    }
    .category-tag {
        font-size: 0.75rem;
        color: #854d0e;
        background: #fef9c3;
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        width: fit-content;
        margin-top: 0.25rem;
    }
    .loading-state, .empty-state, .auth-wrapper {
        text-align: center;
        padding: 2rem;
        color: #71717a;
    }
    .auth-wrapper {
        background: white;
        border-radius: 8px;
        margin-top: 1rem;
    }
    .auth-wrapper p {
        margin-bottom: 1.5rem;
    }
    .ghost-btn {
        background: transparent;
        color: #eab308;
        border: 1px dashed #eab308;
        margin-top: 1rem;
    }
</style>
