<script>
    import { onMount } from 'svelte';
    import { api } from '../scripts/API-Client.js';
    import SkillCard from './SkillCard.svelte';

    let skills = [];
    let search = "";
    let selectedCategory = "";
    let loading = true;

    async function loadData() {
        loading = true;
        try {
            skills = await api.listSkills(search);
        } catch (e) {
            console.error("Failed to load skills:", e);
        } finally {
            loading = false;
        }
    }

    onMount(loadData);

    $: categories = [...new Set(skills.map(s => s.category).filter(Boolean))];

    $: filteredSkills = selectedCategory 
        ? skills.filter(s => s.category === selectedCategory)
        : skills;

    function handleSearch() {
        loadData();
    }
</script>

<section class="panel">
    <h2>Skill Database</h2>
    <div class="controls">
        <input 
            type="text" 
            placeholder="Search skills (e.g. breathing, grounding, planning)" 
            bind:value={search}
            on:input={handleSearch}
        />
        <select bind:value={selectedCategory}>
            <option value="">All categories</option>
            {#each categories as cat}
                <option value={cat}>{cat}</option>
            {/each}
        </select>
    </div>

    {#if loading}
        <p>Loading skills...</p>
    {:else}
        <div class="grid">
            {#each filteredSkills as skill}
                <SkillCard {skill} />
            {:else}
                <p>No skills found.</p>
            {/each}
        </div>
    {/if}
</section>

<style>
    .panel {
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    h2 {
        margin-top: 0;
        color: #333;
    }
    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    input, select {
        padding: 0.6rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
    }
    input {
        flex: 1;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }
</style>
