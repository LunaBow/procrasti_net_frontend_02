<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import Auth from './Auth.svelte';

    let habits = [];
    let newHabitName = "";
    let loading = true;
    let user = null;

    function todayISO() {
        return new Date().toISOString().slice(0, 10);
    }

    async function loadHabits() {
        loading = true;
        try {
            user = await api.getCurrentUser();
            if (user) {
                habits = await api.listHabits();
            }
        } catch (e) {
            console.error("Failed to load habits:", e);
        } finally {
            loading = false;
        }
    }

    async function addHabit() {
        if (!newHabitName.trim()) return;
        try {
            await api.createHabit({ 
                title: newHabitName.trim(),
                schedule_type: "daily"
            });
            newHabitName = "";
            await loadHabits();
        } catch (e) {
            console.error("Failed to add habit:", e);
        }
    }

    async function checkHabit(id) {
        try {
            await api.checkHabit(id, todayISO());
            await loadHabits();
        } catch (e) {
            console.error("Failed to check habit:", e);
        }
    }

    onMount(loadHabits);
</script>

<section class="panel">
    <h2>Habit Tracker</h2>

    <form on:submit|preventDefault={addHabit} class="add-form">
        <input 
            type="text" 
            placeholder="New habit name (e.g. Meditate, Read)" 
            bind:value={newHabitName}
        />
        <button type="submit">Create</button>
    </form>

    {#if loading}
        <p>Loading habits...</p>
    {:else if !user}
        <div class="auth-wrapper">
            <p>Please log in to track your habits.</p>
            <Auth />
        </div>
    {:else}
        <div class="habit-grid">
            {#each habits as habit}
                <article class="habit-card">
                    <div class="info">
                        <h3>{habit.title}</h3>
                        <p class="streak">
                            Current Streak: <span>{habit.streak || 0}</span> days
                        </p>
                    </div>
                    <button 
                        class="check-btn" 
                        on:click={() => checkHabit(habit.id)}
                    >
                        Mark Done Today
                    </button>
                </article>
            {:else}
                <p class="empty">No habits yet. Start small!</p>
            {/each}
        </div>
    {/if}
</section>

<style>
    .panel {
        padding: 1.5rem;
        background: #f0f9ff;
        border-radius: 12px;
    }
    h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #0c4a6e;
    }
    .add-form {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        max-width: 500px;
    }
    input {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid #bae6fd;
        border-radius: 8px;
    }
    button[type="submit"] {
        padding: 0.75rem 1.5rem;
        background: #0ea5e9;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }
    .habit-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    .habit-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-top: 4px solid #0ea5e9;
    }
    h3 {
        margin: 0 0 0.5rem 0;
        color: #1e293b;
    }
    .streak {
        margin: 0 0 1.5rem 0;
        color: #64748b;
        font-size: 0.9rem;
    }
    .streak span {
        font-weight: bold;
        color: #0ea5e9;
        font-size: 1.1rem;
    }
    .check-btn {
        width: 100%;
        padding: 0.6rem;
        background: #e0f2fe;
        color: #0369a1;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }
    .check-btn:hover {
        background: #bae6fd;
    }
    .empty {
        grid-column: 1 / -1;
        text-align: center;
        color: #64748b;
    }
</style>
