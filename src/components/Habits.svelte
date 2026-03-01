<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import Auth from './Auth.svelte';

    let habits = [];
    let newHabitTitle = "";
    let loading = true;
    let user = null;

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
        if (!newHabitTitle.trim()) return;
        try {
            await api.createHabit({ 
                title: newHabitTitle.trim(),
                recurrence_type: "daily"
            });
            newHabitTitle = "";
            await loadHabits();
        } catch (e) {
            console.error("Failed to add habit:", e);
        }
    }

    async function checkHabit(id) {
        try {
            await api.checkHabit(id, new Date().toISOString());
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
            bind:value={newHabitTitle}
        />
        <button type="submit">Create</button>
    </form>

    {#if loading}
        <p>Loading habits...</p>
    {:else if !user}
        <div class="auth-wrapper">
            <p>Please log in to use this feature.</p>
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
