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
        padding: 2.5rem;
        background: var(--surface);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-md);
    }
    h2 {
        font-family: var(--font-heading);
        margin-top: 0;
        color: var(--text);
        font-size: 1.75rem;
        margin-bottom: 2rem;
    }
    .controls {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    input[type="date"] {
        padding: 0.6rem 1rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface-alt);
        color: var(--text);
        font-family: inherit;
        font-size: 0.95rem;
        transition: border-color 0.2s ease;
    }
    input[type="date"]:focus {
        outline: none;
        border-color: var(--primary);
    }
    button {
        padding: 0.6rem 1.25rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 700;
        font-family: inherit;
        transition: all 0.2s ease;
    }
    button:hover:not(:disabled) {
        background: var(--primary-hover);
        transform: translateY(-1px);
    }
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .plan-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .plan-item {
        display: flex;
        align-items: center;
        padding: 1.25rem;
        background: var(--surface-alt);
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        gap: 1.5rem;
        transition: transform 0.2s ease;
    }
    .plan-item:hover {
        transform: translateX(4px);
    }
    .time {
        font-weight: 800;
        color: var(--primary);
        min-width: 70px;
        font-size: 1rem;
    }
    .details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .title {
        font-weight: 700;
        color: var(--text);
        font-size: 1.05rem;
    }
    .category-tag {
        font-size: 0.75rem;
        color: var(--primary);
        background: var(--surface);
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        width: fit-content;
        font-weight: 700;
        border: 1px solid var(--border);
    }
    .loading-state, .empty-state, .auth-wrapper {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--text-muted);
    }
    .auth-wrapper {
        background: var(--surface-alt);
        border-radius: var(--radius-md);
        margin-top: 1rem;
        border: 1px solid var(--border);
    }
    .auth-wrapper p {
        margin-bottom: 1.5rem;
        font-weight: 700;
    }
    .ghost-btn {
        background: transparent;
        color: var(--primary);
        border: 2px dashed var(--border);
        margin-top: 1.5rem;
        font-weight: 700;
    }
    .ghost-btn:hover {
        background: var(--surface);
        border-color: var(--primary);
        color: var(--primary-hover);
    }
</style>
