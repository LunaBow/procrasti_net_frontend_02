<script>
    import Skills from './Skills.svelte';
    import Todos from './Todos.svelte';
    import Habits from './Habits.svelte';
    import Planner from './Planner.svelte';
    import Settings from './Settings.svelte';
    import Calendar from './Calendar.svelte';
    import { onMount } from 'svelte';

    let activeTab = 'skills';

    // Basic hash navigation
    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (['skills', 'todos', 'habits', 'planner', 'settings', 'calendar'].includes(hash)) {
            activeTab = hash;
        }
    }

    onMount(() => {
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    });

    function setTab(tab) {
        activeTab = tab;
        window.location.hash = tab;
    }
</script>

<div class="app-container">
    <nav class="tab-nav">
        <button class:active={activeTab === 'skills'} on:click={() => setTab('skills')}>Skills</button>
        <button class:active={activeTab === 'todos'} on:click={() => setTab('todos')}>Todos</button>
        <button class:active={activeTab === 'habits'} on:click={() => setTab('habits')}>Habits</button>
        <button class:active={activeTab === 'planner'} on:click={() => setTab('planner')}>Planner</button>
        <button class:active={activeTab === 'calendar'} on:click={() => setTab('calendar')}>Calendar</button>
        <button class:active={activeTab === 'settings'} on:click={() => setTab('settings')}>Settings</button>
    </nav>

    <main class="tab-content">
        {#if activeTab === 'skills'}
            <Skills />
        {:else if activeTab === 'todos'}
            <Todos />
        {:else if activeTab === 'habits'}
            <Habits />
        {:else if activeTab === 'planner'}
            <Planner />
        {:else if activeTab === 'calendar'}
            <Calendar />
        {:else if activeTab === 'settings'}
            <Settings />
        {/if}
    </main>
</div>

<style>
    .app-container {
        max-width: 80%;
        margin: auto;
        padding: 10rem;
    }
    .tab-nav {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid var(--border);
        padding-bottom: 0.5rem;
        overflow-x: auto;
    }
    .tab-nav button {
        padding: 0.5rem 1rem;
        background: transparent;
        border: none;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        font-weight: 600;
        color: var(--text-muted);
        white-space: nowrap;
        transition: all 0.2s;
    }
    <script>
     import Skills from './Skills.svelte';
    import Todos from './Todos.svelte';
    import Habits from './Habits.svelte';
    import Planner from './Planner.svelte';
    import Settings from './Settings.svelte';
    import Calendar from './Calendar.svelte';
    import { onMount } from 'svelte';

    let activeTab = 'skills';

    // Basic hash navigation
       function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (['skills', 'todos', 'habits', 'planner', 'settings', 'calendar'].includes(hash)) {
        activeTab = hash;
    }
    }

    onMount(() => {
                handleHash();
                    window.addEventListener('hashchange', handleHash);
                    return () => window.removeEventListener('hashchange', handleHash);
                });

    function setTab(tab) {
        activeTab = tab;
    window.location.hash = tab;
    }
    </script>

    <div class="app-container">
    <nav class="tab-nav">
    <button class:active={activeTab === 'skills'} on:click={() => setTab('skills')}>Skills</button>
    <button class:active={activeTab === 'todos'} on:click={() => setTab('todos')}>Todos</button>
    <button class:active={activeTab === 'habits'} on:click={() => setTab('habits')}>Habits</button>
    <button class:active={activeTab === 'planner'} on:click={() => setTab('planner')}>Planner</button>
    <button class:active={activeTab === 'calendar'} on:click={() => setTab('calendar')}>Calendar</button>
    <button class:active={activeTab === 'settings'} on:click={() => setTab('settings')}>Settings</button>
    </nav>

    <main class="tab-content">
                             {#if activeTab === 'skills'}
    <Skills />
             {:else if activeTab === 'todos'}
    <Todos />
            {:else if activeTab === 'habits'}
    <Habits />
             {:else if activeTab === 'planner'}
    <Planner />
              {:else if activeTab === 'calendar'}
    <Calendar />
               {:else if activeTab === 'settings'}
    <Settings />
               {/if}
    </main>
    </div>

    <style>
     .app-container {
         max-width: 1000px;
         margin: 0 auto;
         padding: 1rem;
     }
    .tab-nav {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid var(--border);
        padding-bottom: 0.5rem;
        overflow-x: auto;
    }
    .tab-nav button {
        padding: 0.5rem 1rem;
        background: transparent;
        border: none;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        font-weight: 600;
        color: var(--text-muted);
        white-space: nowrap;
        transition: all 0.2s;
    }
    .tab-nav button:hover {
        background: var(--surface-alt);
        color: var(--text);
    }
    .tab-nav button.active {
        color: var(--primary);
        position: relative;
    }
    .tab-nav button.active::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary);
    }
    .tab-content {
        animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

